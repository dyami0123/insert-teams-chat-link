import { App, Editor, moment, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


export default class insertTeamsChatLink extends Plugin {
	async onload() {
		// This adds an editor command that prompts for a link and inserts it
		this.addCommand({
			id: 'teams-chat-link',
			name: 'Insert Teams Chat Link',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.promptForLink(editor);
			},
		});
	}

	// Function to prompt for link input and insert into editor
	promptForLink(editor: Editor) {
		const promptModal = new parseTeamsLinkModal(this.app, (userInput: string) => {
			// Insert the link into the editor at the current cursor position

			let formattedLink = `[Teams Chat](${userInput})`;

			editor.replaceRange(formattedLink, editor.getCursor());
		});
		promptModal.open();
	}
}


// PromptModal class to handle input dialog
class parseTeamsLinkModal extends Modal {
	constructor(app, onSubmit) {
	  super(app);
	  this.onSubmit = onSubmit;
	}
  
	onOpen() {
	  const { contentEl } = this;
	  contentEl.createEl('h2', { text: 'Enter A Link to a Teams Chat' });
  
	  // Create a text input box
	  const input = contentEl.createEl('input', { type: 'text' });
	  input.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			this.close();
			if (this.verifyLink(input.value)) {
				let chatId = this.extractChatId(input.value);
				let chatType = this.extractChatType(input.value);

				console.log(`Chat ID: ${chatId}`);
				console.log(`Chat Type: ${chatType}`);

				if (!chatId || !chatType) {
					new Notice("Invalid link. Please enter a valid Teams chat link.");
					return
				}
				let chatLink = this.createChatLink(chatId, chatType);
				console.log(`Chat Link: ${chatLink}`);
				this.onSubmit(chatLink);
			} else {
				new Notice("Invalid link. Please enter a valid Teams chat link.");
			}
		}
	  });
  
	  input.focus(); // Auto-focus the input box
	}
	
	verifyLink(link: string): boolean {

		// https://teams.microsoft.com/l/message/19:2408b794-562f-4cbd-9fcc-d552bf662e4a_28dfec61-0222-4d98-a68f-c887adc08855@unq.gbl.spaces/1729895093786?context=%7B%22contextType%22%3A%22chat%22%7D
		// things to check for:
		// - starts with https://teams.microsoft.com/l/
		// the element after com/l/xxx/ begins with "19:..."
		// if the link contains @thread.v2 that is the stopping point of the chat id (group message)
		// if the link contains @unq.gbl.spaces that is the stopping point of the chat id (private message)
		let verificationRegex = /^https:\/\/teams\.microsoft\.com\/l\/message\/19:[a-zA-Z0-9-]+(?:@thread\.v2|@unq\.gbl\.spaces)?/;
		return verificationRegex.test(link);
	}

	extractChatId(link: string): string | null {
		let chatIdRegex = /19:([a-zA-Z0-9_-]+)(?:@thread\.v2|@unq\.gbl\.spaces)?/;
		let match = chatIdRegex.exec(link);
		if (match) {
			return `19:${match[1]}`;
		} else {
			return null;
		}
	}

	extractChatType(link: string): string | null {
		//https://teams.microsoft.com/l/message/19:2408b794-562f-4cbd-9fcc-d552bf662e4a_de95db53-8b6e-4200-bdf2-0b715c64cf68@unq.gbl.spaces/1729888448417?context=%7B%22contextType%22%3A%22chat%22%7D
		// the link above should be valid
		let chatTypeRegex = /19:[a-zA-Z0-9-]+(?:_[a-zA-Z0-9-]+)?(@thread\.v2|@unq\.gbl\.spaces)/;
		let match = chatTypeRegex.exec(link);
		console.log(`Link: ${link}`);
		console.log(`Match: ${match}`);
		if (match) {
			console.log(`Match[1]: ${match[1]}`);
			return match[1];
		} else {
			return null;
		}
	}

	createChatLink(chatId: string, chatType: string): string {
		return `https://teams.microsoft.com/l/chat/${chatId}${chatType}`;
	}
	
	onClose() {
	  const { contentEl } = this;
	  contentEl.empty();
	}
  }