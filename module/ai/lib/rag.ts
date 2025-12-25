import { pineconeIndex } from "@/lib/pinecone";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

interface Vector {
  id: string;
  values: number[];
  metadata: {
    repoId: string;
    path: string;
    chunkIndex: number;
    content: string;
  };
}

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: text,
  });

  return embedding;
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[]
) {
  const vectors: Vector[] = [];

  const chunkFile = (
    content: string,
    path: string,
    maxLength = 7500
  ): string[] => {
    const chunks: string[] = [];
    let currentChunk = `file:${path}\n\n`;

    while (content.length > 0) {
      const remaining = maxLength - currentChunk.length;
      if (content.length <= remaining) {
        currentChunk += content;
        if (currentChunk.length > 100) chunks.push(currentChunk);
        break;
      }

      const splitIndex = content.lastIndexOf("\n", remaining);
      const chunkEnd = splitIndex !== -1 ? splitIndex : remaining;

      currentChunk += content.slice(0, chunkEnd);
      if (currentChunk.length > 100) chunks.push(currentChunk);

      content = content.slice(chunkEnd);
      currentChunk = `file:${path}\n\n`;
    }

    return chunks;
  };

  for (const file of files) {
    const contentChunks = chunkFile(
      `file:${file.path}\n\n${file.content}`,
      file.path
    );

    for (let i = 0; i < contentChunks.length; i++) {
      const chunkContent = contentChunks[i];
      const chunkId = `${repoId}-${file.path.replace(/\//g, "_")}-chunk${i}`;

      try {
        const embedding = await generateEmbedding(chunkContent);
        vectors.push({
          id: chunkId,
          values: embedding,
          metadata: {
            repoId,
            path: file.path,
            chunkIndex: i,
            content: chunkContent,
          },
        });
      } catch (error) {
        console.error(`Failed to embed ${file.path} chunk ${i}:`, error);
      }
    }
  }

  if (vectors.length > 0) {
    const batchSize = 50;
    for (let i = 0; i < vectors.length; i += batchSize) {
      try {
        const batch = vectors.slice(i, i + batchSize);
        await pineconeIndex.upsert(batch);
        console.log(
          `Upserted batch ${i / batchSize + 1}/${Math.ceil(
            vectors.length / batchSize
          )}`
        );
      } catch (error) {
        console.error(`Failed batch ${i / batchSize + 1}:`, error);
      }
    }
  }

  console.log(`Indexing complete! ${vectors.length} vectors upserted.`);
}

export async function retrieveContent(
  query: string,
  repoId: string,
  topK: number = 5
) {
  try {
    const embedding = await generateEmbedding(query);

    const result = await pineconeIndex.query({
      vector: embedding,
      filter: { repoId: { $eq: repoId } },
      topK,
      includeMetadata: true,
    });

    return result.matches
      .map((match) => match.metadata?.content as string)
      .filter(Boolean);
  } catch (error) {
    console.error("Retrieval failed:", error);
    return [];
  }
}
