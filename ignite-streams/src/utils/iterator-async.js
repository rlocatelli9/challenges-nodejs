import { parse } from 'csv-parse';
import fs from 'node:fs/promises'

async function iteratorAsync () {
  const dataPath = new URL('../../data.csv', import.meta.url);

  const content = await fs.readFile(dataPath, 'utf8');
  const records = parse(content, {
    bom: true,
    delimiter: ',',
    trim: true,
    fromLine:2
  });
  let count = 0;
  process.stdout.write('importando e criando tarefas...\n');

  for await (const record of records) {
      const [title, description] = record

     const data = JSON.stringify({
        title,
        description,
      })

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data, 
      };
  
     await fetch('http://localhost:3333/tasks', options);

    count++
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  process.stdout.write(`\ntotal de tarefas criadas: ${count}\n`);
};

await iteratorAsync();