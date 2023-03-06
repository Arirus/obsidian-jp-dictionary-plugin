import { App, Modal, Setting, ButtonComponent, Notice, TextComponent } from 'obsidian';
import { TranslatorSettings } from 'settings';
import { bingTranslate, chatTranslate } from 'translate';




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

export class ChatGPTModal extends Modal {

    queryString: string

    loadingView = createEl('div', {
        cls: 'translator_container-overlay',
        text: 'Translating...'
    })
    containerView = createDiv({ cls: "translator_container", title: "Bing" })


    constructor(app: App,
        queryString: string) {
        super(app)


        this.queryString = queryString
    }

    onOpen(): void {
        const { containerView, contentEl } = this


        const textArea = new TextComponent(contentEl).setPlaceholder("输出")

        new ButtonComponent(contentEl).setButtonText("翻译").onClick(() => {

            containerView.appendChild(createEl('div', {
                cls: 'translator_container-bing-src',
                text: textArea.getValue(),
            }))
            chatTranslate(textArea.getValue(), "", "", (result) => {
                containerView.appendChild(createEl('div', {
                    cls: 'translator_container-bing-dst',
                    text: result,
                }))
            })

        })

        contentEl.appendChild(this.containerView)

    }



}



export class TranslateModal extends Modal {
    queryString: string
    settings: TranslatorSettings

    containerView = createDiv({ cls: "translator_container", title: "Bing" })

    loadingView = createEl('div', {
        cls: 'translator_container-overlay',
        text: 'Translating...'
    })

    resultView = createEl('div', {
        cls: 'translator_container-result',
        text: 'Result'
    })

    constructor(app: App,
        queryString: string,
        settings: TranslatorSettings) {
        super(app)


        this.queryString = queryString
        this.settings = settings
    }


    onOpen(): void {
        const { containerView, contentEl, settings } = this
        contentEl.createEl('h1', { text: 'Translator', cls: 'translator_title' })



        new Setting(contentEl)
            .setName("翻译")
            .setDesc("使用Bing进行翻译")
            .addDropdown((drop) => {
                drop.addOption("en", "英语")
                drop.addOption("ja", "日语")
                drop.addOption("cn-zh", "中文")
                drop.setValue(settings.dst).onChange((value => {
                    settings.dst = value
                    console.log("Arirus Dropdown", value)
                }))
            })
            .addText((text) => {
                text.setValue(this.queryString)
                text.setPlaceholder("翻译内容")
                text.onChange((value) => {
                    this.queryString = value
                })
            });


        const onSubmit = () => {
            containerView.empty()

            containerView.appendChild(this.loadingView)
            bingTranslate(this.queryString, "", settings.dst, (result: string) => {
                containerView.removeChild(this.loadingView)
                containerView.appendChild(this.resultView)
                containerView.appendChild(createEl('div', {
                    cls: 'translator_container-bing-src',
                    text: this.queryString,
                }))
                containerView.appendChild(createEl('div', {
                    cls: 'translator_container-bing-dst',
                    text: result,
                }))
            })
        }

        new Setting(contentEl)
            .setClass("translate_submit_btn")
            .addButton((btn) =>
                btn.setButtonText("Submit")
                    .setCta()
                    .setDisabled(false)
                    .onClick(onSubmit));

        contentEl.appendChild(this.containerView)



    }


    onSubmit1(): void {
        const { contentEl, settings } = this;
        // contentEl.find("translate_submit_btn").



        const settingCommpont = contentEl.getElementsByClassName("translate_submit_btn");

        contentEl.appendChild(this.loadingView)
        contentEl.removeChild(this.resultView)
        bingTranslate(this.queryString, "", settings.dst, (result: string) => {
            contentEl.removeChild(this.loadingView)
            contentEl.appendChild(this.resultView)
            this.resultView.appendChild(createEl('div', {
                cls: 'translator_container-bing',
                text: result
            }))
        })
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty()
    }

}
