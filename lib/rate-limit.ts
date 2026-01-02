interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitRecord>();

export function createRateLimiter(maxRequests: number, windowMs: number = 3600000) {
  return async (identifier: string): Promise<{
    success: boolean;
    remaining: number;
    retryAfter?: number;
  }> => {
    const now = Date.now();
    const windowKey = `${identifier}:${Math.floor(now / windowMs) * windowMs}`;
    
    let record = rateLimits.get(windowKey);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
    } else {
      record.count++;
    }
    
    rateLimits.set(windowKey, record);
    
  
    setTimeout(() => rateLimits.delete(windowKey), windowMs);
    
    if (record.count > maxRequests) {
      return {
        success: false,
        remaining: 0,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      };
    }
    
    return {
      success: true,
      remaining: maxRequests - record.count,
    };
  };
}


export const repoLimiter = createRateLimiter(5, 3600000);   // Free: 5 repos/hour
export const reviewLimiter = createRateLimiter(20, 3600000); // Free: 20 reviews/hour
export const proRepoLimiter = createRateLimiter(100, 3600000);  // Pro: 100/hour
export const proReviewLimiter = createRateLimiter(500, 3600000); // Pro: 500/hour
