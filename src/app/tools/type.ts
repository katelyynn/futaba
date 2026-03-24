export function releaseType(type: string) {
  if (type == 'ep')  {
    return 'EP';
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}