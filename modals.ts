import { App, Editor, Modal, Setting } from 'obsidian';
import { TranslatorSettings } from 'settings';



export class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Woah!');
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export class PanelModal extends Modal {
    constructor(app: App,) {
        super(app)
    }

    onOpen(): void {
        const { containerEl, contentEl } = this;



    }
}

export class TranslateModal extends Modal {
    queryString: string
    settings: TranslatorSettings

    constructor(app: App,
        queryString: string,
        settings: TranslatorSettings) {
        super(app)


        this.queryString = queryString
        this.settings = settings
    }


    onOpen(): void {
        const { containerEl, contentEl, settings } = this
        contentEl.createEl('h1', { text: 'Translator', cls: 'translator_title' })



        new Setting(contentEl)
            .setName("翻译")
            .setDesc("使用Bing进行翻译")
            .addTextArea((text) => {
                text.setValue(this.queryString)
                text.setPlaceholder("翻译内容")
                text.onChange((value) => {
                    this.queryString = value
                })
            }).addDropdown((drop) => {
                drop.addOption("en", "英语")
                drop.addOption("ja", "日语")
                drop.addOption("cn-zh", "中文")
                drop.setValue(settings.dst).onChange((value => {
                    settings.dst = value
                    console.log("Arirus Dropdown", value)
                }))
            });


        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Submit")
                    .setCta()
                    .onClick(() => {
                        this.close();
                    }));

    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty()
    }

}
