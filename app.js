const fs = require('fs');
const inquirer = require('inquirer');

// Load notes from notes.json
const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    return JSON.parse(dataBuffer);
  } catch {
    return [];
  }
};

// Save notes to notes.json
const saveNotes = (notes) => {
  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
};

// Main menu
const mainMenu = async () => {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '📌 What would you like to do?',
    choices: [
      'Add Note',
      'List Notes',
      'Edit Note',
      'Delete Note',
      'Search Notes',
      'Exit'
    ],
  });

  const notes = loadNotes();

  switch (action) {
    case 'Add Note':
      const { text } = await inquirer.prompt({
        type: 'input',
        name: 'text',
        message: '📝 Enter your note:',
      });
      notes.push({ text, timestamp: new Date().toLocaleString() });
      saveNotes(notes);
      console.log('✅ Note added!');
      break;

    case 'List Notes':
      if (notes.length === 0) {
        console.log('📭 No notes found.');
      } else {
        console.log('📒 Your Notes:');
        notes.forEach((note, i) => {
          console.log(`${i + 1}. ${note.text} (added on ${note.timestamp})`);
        });
      }
      break;

    case 'Edit Note':
      if (notes.length === 0) {
        console.log('📭 No notes to edit.');
        break;
      }
      const { editIndex } = await inquirer.prompt({
        type: 'list',
        name: 'editIndex',
        message: '✏️ Select a note to edit:',
        choices: notes.map((note, i) => ({
          name: `${i + 1}. ${note.text}`,
          value: i
        })),
      });
      const { newText } = await inquirer.prompt({
        type: 'input',
        name: 'newText',
        message: '🆕 Enter new text:',
      });
      notes[editIndex].text = newText;
      notes[editIndex].timestamp = new Date().toLocaleString();
      saveNotes(notes);
      console.log('✏️ Note updated!');
      break;

    case 'Delete Note':
      if (notes.length === 0) {
        console.log('📭 No notes to delete.');
        break;
      }
      const { deleteIndex } = await inquirer.prompt({
        type: 'list',
        name: 'deleteIndex',
        message: '🗑️ Select a note to delete:',
        choices: notes.map((note, i) => ({
          name: `${i + 1}. ${note.text}`,
          value: i
        })),
      });
      notes.splice(deleteIndex, 1);
      saveNotes(notes);
      console.log('🗑️ Note deleted!');
      break;

    case 'Search Notes':
      const { keyword } = await inquirer.prompt({
        type: 'input',
        name: 'keyword',
        message: '🔍 Enter a keyword to search:',
      });
      const filtered = notes.filter(note =>
        note.text.toLowerCase().includes(keyword.toLowerCase())
      );
      if (filtered.length) {
        console.log('🔎 Matching Notes:');
        filtered.forEach((note, i) => {
          console.log(`${i + 1}. ${note.text} (added on ${note.timestamp})`);
        });
      } else {
        console.log('❌ No matching notes found.');
      }
      break;

    case 'Exit':
      console.log('👋 Goodbye!');
      return;
  }

  // Repeat
  await mainMenu();
};

mainMenu();
