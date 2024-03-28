import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { TextSelection } from "prosemirror-state";
import { PluginKey } from "@tiptap/pm/state";

export const AutocompleteGemini = Extension.create({
    name: "AutocompleteExtension",

    addOptions() {
        return {
            className: "autocomplete-suggestion",
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply: (transaction) => {
                        let decorationSet = DecorationSet.empty;

                        const selection = transaction.selection;
                        if (!(selection instanceof TextSelection)) {
                            return decorationSet;
                        }

                        let textContent = this.storage.autosuggestion || "";

                        if (textContent === "") {
                            return decorationSet;
                        }

                        // This will add the widget decoration at the  cursor position
                        const cursorPos = selection.$head.pos;
                        const nextNode = transaction.doc.nodeAt(cursorPos);

                        if (!nextNode || nextNode.isBlock) {
                            const suggestionDecoration = Decoration.widget(
                                cursorPos,
                                () => {
                                    const parentNode =
                                        document.createElement("span");

                                    // Create a span for the suggestion
                                    var c =
                                        '<span style="opacity: 40%;">' +
                                        textContent +
                                        "</span>";
                                    parentNode.innerHTML = c;
                                    parentNode.classList.add(
                                        this.options.className,
                                    );

                                    return parentNode;
                                },
                                { side: 1 },
                            );

                            decorationSet = decorationSet.add(transaction.doc, [
                                suggestionDecoration,
                            ]);
                        }
                        return decorationSet;
                    },
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                },
            }),
            new Plugin({
                key: new PluginKey("autocomplete"),
                props: {
                    handleKeyDown: (view, event) => {
                        const storage = this.storage;
                        const { state } = view;
                        if (event.key === "Tab") {
                            let textContent = storage.autosuggestion || "";
                            const loader =
                                '<span class="generating"><span>&#x2022;</span><span>&#x2022;</span><span>&#x2022;</span></span>';
                            if (textContent !== "" && textContent !== loader) {
                                event.preventDefault();
                                // Insert the autosuggestion at the cursor position
                                const tr = view.state.tr.insertText(
                                    textContent,
                                    state.selection.from,
                                );
                                this.storage.autosuggestion = "";
                                view.dispatch(tr);
                            }
                        }
                    },
                },
            }),
        ];
    },
});
