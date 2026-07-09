export function releaseType(type: string) {
  if (type == 'ep')  {
    return 'EP';
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function sanitiseReleaseType(type: string) {
  if (['deluxe', 'ep'].includes(type)) {
    return 'album';
  }

  return type;
}
