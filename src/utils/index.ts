export function extractToken(auth: string): string | undefined {
  const [type, token] = auth.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}