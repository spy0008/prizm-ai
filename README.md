# PRizm
Your AI reviewer for GitHub pull requests

## Short summary
PRizm provides automated, production grade code reviews for pull requests. Using repository context and diffs it generates focused, actionable comments on PRs and posts them to GitHub. The project includes a web dashboard to manage connected repositories, view generated reviews, and manage subscriptions.

## What we deliver
1. GitHub native reviews
2. Automated PR commenting with AI generated suggestions
3. Dashboard for repository and subscription management
4. Per user usage tracking and subscription tiers
5. Webhooks and background workflows for resilient, asynchronous processing
6. Production ready considerations for security, scaling, and monitoring

## System overview
PRizm is a Next.js frontend and server API with the following major components

1. Frontend
   - Built with Next.js app router
   - Pages for login, dashboard, repository management, reviews, and subscription settings
   - Uses the application backend APIs and library helpers to show reviews and manage repositories

2. Backend
   - Next.js API routes for GitHub webhooks, auth, and internal APIs
   - Inngest event functions for background and async jobs such as generating reviews and posting comments
   - Integration with GitHub via Octokit and GitHub OAuth
   - Integration with Polar for payments and subscriptions
   - Database persistence using Prisma and PostgreSQL
   - Pinecone vector store for contextual retrieval when needed

## Frontend flow and user experience
1. User signs in with GitHub using the built in OAuth provider
2. Onboarding guides users to connect repositories and create webhooks
3. When a user connects a repo we create a webhook pointing to the app webhook endpoint
4. Dashboard shows repository list, recent reviews and subscription status
5. Users can view review history and open full reviews on GitHub

## Backend flow and core logic
1. GitHub sends a pull request event to the webhook API route
2. Webhook handler validates the event and emits an Inngest event e g pr review requested
3. Inngest runs the review pipeline
   - It fetches repo files and diff using Octokit
   - It prepares the prompt and calls the AI/LLM model to generate a review
   - It posts the review back to the PR on GitHub via the GitHub API
   - It saves the generated review and metadata in the database
4. The pipeline uses concurrency limits and rate limit guards to prevent abuse

## Where AI inference happens
1. Prompt generation and calling the AI model happens inside the Inngest review function
2. The prompt includes PR diff, changed files context, and configuration to keep reviews professional and actionable
3. The system stores review text in the database for history and dashboard display

## Authentication and user management
1. Authentication is handled by the Better Auth library configured with a Prisma adapter
2. Social login with GitHub is supported and requested scopes include repository access
3. Sessions and user accounts are stored in the database using the Session and Account models
4. When a user connects their GitHub account we store the access token in the Account model
5. The system uses helper methods to retrieve the token for API calls requiring repo or PR access

## Database schema and models (high level)
1. User model stores user profile, subscription fields and polar customer ids
2. Repository model stores repository metadata and the owning user relation
3. Review model stores generated reviews along with PR metadata and status
4. Session and Account models store authentication and OAuth tokens
5. UserUsage model tracks repository count and review counts per repository

The schema is defined with Prisma in prisma schema file and persisted in PostgreSQL

## Rate limiting and abuse prevention
1. Application level rate limiters are implemented in memory and exposed as helpers
2. The default limits are tuned per plan
   - Free plan: limited repos and reviews per hour
   - Pro plan: higher quotas and separate limiters
3. Limiters return remaining allowance and retry after time to enable graceful handling
4. Rate limiting is applied before heavy operations such as generating a review or creating webhook subscriptions

## Payments and subscription management
1. Polar is used to manage checkout, subscription status and webhooks
2. The auth plugin integrates checkout, portal, usage and webhooks to automate subscription lifecycle changes
3. On subscription events system updates user tier and subscription fields in the database
4. Billing webhooks are validated and handled inside the auth setup

## Security recommendations and responsibilities
1. Secrets must be stored securely in environment variables or a secrets store
   - GitHub client id and secret
   - Polar API keys and webhook secret
   - Pinecone API key
   - Database connection string
2. HTTPS is required in production for GitHub webhooks and OAuth callbacks
3. Validate and verify webhook payloads before processing using built in signatures when available
4. Limit the scopes requested from third party providers to what is strictly necessary e g repo scope for posting comments
5. Rotate tokens and credentials on a regular schedule
6. Store access tokens securely in the database and never expose them to the browser

## Observability and monitoring
1. Log important events including webhook receipts, errors during review generation, and posting failures
2. Use an error tracking service and aggregate logs for quick diagnosis
3. Monitor Inngest function concurrency, queue lengths and failures
4. Track business metrics e g number of reviews, number of connected repos, subscription revenue

## Data retention and backups
1. Store generated reviews and metadata with timestamps for auditing and history
2. Implement PostgreSQL backups and regular restore drills
3. If using Pinecone or other vector stores keep snapshots of index ids and reindex strategy

## Running locally and environment variables
1. Install dependencies
   - npm install
2. Environment variables used by the application include but are not limited to
   - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET for GitHub OAuth
   - DATABASE_URL for Postgres connection
   - NEXT_PUBLIC_APP_BASE_URL for webhook creation and callback URLs
   - POLAR api keys and secrets for payments
   - PINECONE_DB_API_KEY for vector index interactions
3. Start the app locally and expose a public URL for GitHub webhooks using a tool such as ngrok
4. Run migrations with Prisma and ensure the database is seeded as needed

## Deployment recommendations
1. Use a managed Postgres database and enable automated backups
2. Deploy Next.js app to an SSR capable host that supports serverless or node runtimes
3. Ensure the webhook endpoint is reachable via HTTPS and set the webhook secret in GitHub if used
4. Run Inngest functions in a persistent environment or use Inngest cloud to host the background jobs
5. Provision the Pinecone index before enabling advanced contextual review features
6. Monitor rate limiter metrics and scale limits or move to a distributed rate limiter for multi node deployments

## Testing and quality
1. Include unit and integration tests for core helpers such as the GitHub helpers and rate limiter
2. Add end to end tests for the webhook flow and review generation pipeline
3. Validate OAuth flows in test environments with a test GitHub app or test user

## Troubleshooting common issues
1. Missing GitHub token for account
   - Ensure user completed OAuth sign in and the Account model contains an access token
2. Webhook not being received
   - Verify webhook URL, ensure HTTPS and correct event subscriptions
3. Review generation errors
   - Check logs for AI provider errors, rate limits, or parsing issues
4. Rate limits blocked operations
   - Adjust plan or increase rate limits and inform users about retryAfter times

## Contributing
1. Follow the code style used in the repository
2. Add tests for new functionality and update documentation
3. Run existing tests and validate flows locally before opening a pull request

## Support and contact
For issues or questions open an issue on the repository or contact the maintainer


---

This README provides a complete overview for developers and operators running PRizm in development or production. It is designed to be practical and production ready with recommendations for scaling and security.