export function extractToken(auth: string): (string | undefined) {
  let token: string | undefined = undefined;
  if(auth.startsWith('Bearer ')) {
    token = auth.substring(7, auth.length)
  }
  return token
}