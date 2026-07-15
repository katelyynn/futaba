export function note(text: string, system: string, data?: object[]) {
  let colour;

  switch (system) {
    case 'engine':
      colour = `#31748f`;
      break;
    case 'audio':
      colour = `#9ccfd8`;
      break;
    case 'request':
      colour = `#eb6f92`;
      break;
  }

  if (data) {
    console.info(`%c${system}%c ${text}`, `background: ${colour}; font-weight: bold; color: #000; padding: 0 1px; width: 50px; display: inline-block;`, 'color: unset;', data);
  } else {
    console.info(`%c${system}%c ${text}`, `background: ${colour}; font-weight: bold; color: #000; padding: 0 1px; width: 50px; display: inline-block;`, 'color: unset;');
  }
}
