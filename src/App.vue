<template>
  <div id="app">
    <h1>Vue Single Line Monaco Editor - Custom Language Theme</h1>
    <monaco-singleline
      v-model="line"
      placeholder="this is placeholder"
      :language="langId"
      :theme="theme"
      :options="opts"
      :editorBeforeMount="onEditorBeforeMount"
      :editorMounted="onEditorMounted"
      style="width: 50%"
    />
    <monaco-singleline
      v-model="line2"
      :language="langId"
      :theme="theme"
      :options="opts"
      :editorBeforeMount="onEditorBeforeMount"
      :editorMounted="onEditorMounted"
      style="width: 400px"
    />
    <monaco-singleline
      v-model="line3"
      placeholder="type `http` should see autocompletion"
      :language="langId"
      :theme="theme"
      :options="opts"
      :editorBeforeMount="onEditorBeforeMount"
      :editorMounted="onEditorMounted"
    />
    <div>
      <p>
        Demo of:
        <a href="https://github.com/vikyd/vue-monaco-singleline" target="_blank"
          >https://github.com/vikyd/vue-monaco-singleline</a
        >
      </p>
      <p>
        Source code of this demo:
        <a
          href="https://github.com/vikyd/vue-monaco-singleline-custom-language"
          target="_blank"
          >https://github.com/vikyd/vue-monaco-singleline-custom-language</a
        >
      </p>
      <p>Completion works locally, but not working on codesandbox.io</p>
    </div>
  </div>
</template>

<script>
import MonacoSingleline from 'vue-monaco-singleline'
import MonacoEditor from 'monaco-editor-vue'

const VarToken = /\{\{\w+\}\}/
const TokenNames = {
  http: 'http',
  https: 'https',
  vars: 'vars',
}

export default {
  name: 'App',
  components: {
    MonacoSingleline,
    MonacoEditor,
  },
  data() {
    return {
      line: 'https://google.com?a={{varA}}&b={{varB}}',
      line2: 'http://{{host}}.com',
      line3: '',
      x: '',
      opts: {
        fontFamily:
          'PingFang SC, -apple-system, Helvetica Neue, Helvetica, BlinkMacSystemFont, Microsoft YaHei, tahoma, Arial, Open Sans, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif',
      },
      langId: 'httpLang',
      theme: 'myTheme',
    }
  },
  methods: {
    onEditorBeforeMount(monaco) {
      console.log('onEditorBeforeMount')
      const langMap = {}
      monaco.languages.getLanguages().forEach((item) => {
        langMap[item.id] = item.id
      })
      if (!langMap[this.langId]) {
        this.registerNewLang(monaco)
        this.addAutoCompletion(monaco)
        this.defineNewTheme(monaco)
      }
    },
    onEditorMounted(editor, monaco) {
      console.log('onEditorMounted')
    },
    doo(monaco) {
      console.log(123)
      // Register a new language
      monaco.languages.register({ id: 'mySpecialLanguage' })

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
        tokenizer: {
          root: [
            [/\[error.*/, 'custom-error'],
            [/\[notice.*/, 'custom-notice'],
            [/\[info.*/, 'custom-info'],
            [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
          ],
        },
      })

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs',
        inherit: false,
        rules: [
          { token: 'custom-info', foreground: '808080' },
          { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
          { token: 'custom-notice', foreground: 'FFA500' },
          { token: 'custom-date', foreground: '008800' },
        ],
      })

      // Register a completion item provider for the new language
      monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
        provideCompletionItems: () => {
          var suggestions = [
            {
              label: 'simpleText',
              kind: monaco.languages.CompletionItemKind.Text,
              insertText: 'simpleText',
            },
            {
              label: 'testing',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'testing(${1:condition})',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
            {
              label: 'ifelse',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'if (${1:condition}) {',
                '\t$0',
                '} else {',
                '\t',
                '}',
              ].join('\n'),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'If-Else Statement',
            },
          ]
          return { suggestions: suggestions }
        },
      })
    },
    registerNewLang(monaco) {
      monaco.languages.register({ id: this.langId })

      monaco.languages.setMonarchTokensProvider(this.langId, {
        kwHttp: [TokenNames.http],
        kwHttps: [TokenNames.https],
        tokenizer: {
          root: [
            [VarToken, TokenNames.vars],
            [
              /^([a-z][\w]*)(:\/\/)/,
              [
                // match first parentheses ↑
                {
                  cases: {
                    '@kwHttps': TokenNames.https,
                    '@kwHttp': TokenNames.http,
                  },
                },
                // match second parentheses
                '',
              ],
            ],
          ],
        },
      })
    },
    defineNewTheme(monaco) {
      monaco.editor.defineTheme(this.theme, {
        base: 'vs',
        inherit: true,
        rules: [
          { token: TokenNames.vars, foreground: '0052d9' },
          {
            token: TokenNames.http,
            foreground: 'ff0000',
            fontStyle: 'bold',
          },
          {
            token: TokenNames.https,
            foreground: '40b13c',
            fontStyle: 'bold',
          },
        ],
      })
    },
    addAutoCompletion(monaco) {
      console.log('set')
      console.log(this.langId)
      console.log(monaco.languages.registerCompletionItemProvider)

      monaco.languages.registerCompletionItemProvider(this.langId, {
        // triggerCharacters: ["."],

        provideCompletionItems(model, position) {
          console.log('before ')
          const range = {
            starLineNumber: 1,
            startColumn: position.column,
            endLineNumber: 1,
            endColumn: position.column,
          }

          const line = model.getLineContent(1)
          console.log('before line')
          const before = line.slice(0, position.column - 2)
          const beforeWith = line.slice(0, position.column - 1)
          const startBracketIndex = before.lastIndexOf('{{')
          const endBracketIndex = before.lastIndexOf('}}')
          const currentChar = line[position.column - 2]
          console.log('after line')

          const NoIdx = -1
          if (
            startBracketIndex === NoIdx &&
            endBracketIndex === NoIdx &&
            'https://'.startsWith(beforeWith)
          ) {
            console.log('ok')
            return {
              suggestions: [
                {
                  label: 'http://',
                  kind: monaco.languages.CompletionItemKind.Field,
                  insertText: 'http://',
                },
                {
                  label: 'https://',
                  kind: monaco.languages.CompletionItemKind.Field,
                  insertText: 'https://',
                },
              ],
              range,
            }
          }

          const Domains = ['com']
          if (currentChar === '.') {
            const dArr = Domains.map((item) => ({
              label: item,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: item,
            }))
            console.log('com')
            return {
              suggestions: dArr,
              range,
            }
          }

          if (startBracketIndex <= endBracketIndex) {
            console.log('empty')
            return ''
          }

          console.log('last')
          const suggestions = []
          return {
            suggestions,
            range,
          }
        },
      })
      console.log('after')
    },
  },
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
