/* script.js */
/* 
  - ページ読み込み後に実行される初期化処理
  - Highlight.js の実行
  - CodeMirror のエディタ化
  - タブ切替、プレビュー更新、リセットなどの関数
*/

let htmlEditor, cssEditor, jsEditor;
let pgHtmlEditor, pgCssEditor, pgJsEditor;

// ページ読み込み後の処理
document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight.js を適用
    hljs.highlightAll();

    // 2. CodeMirror のエディタを初期化
    initCodeMirrorEditors();

    // ※ ダークモード切替は削除
});

/* CodeMirrorの初期化 */
function initCodeMirrorEditors() {
    // HTMLセクション
    const htmlTextarea = document.getElementById('html-code');
    htmlEditor = CodeMirror.fromTextArea(htmlTextarea, {
        mode: 'htmlmixed',
        theme: 'darcula',
        lineNumbers: true
    });
    htmlEditor.on('change', updateHTMLPreview);

    // CSSセクション
    const cssHtmlTextarea = document.getElementById('css-html-code'); // readonly
    const cssCodeTextarea = document.getElementById('css-code');
    cssEditor = CodeMirror.fromTextArea(cssCodeTextarea, {
        mode: 'css',
        theme: 'darcula',
        lineNumbers: true
    });
    cssEditor.on('change', updateCSSPreview);

    // JSセクション
    const jsHtmlTextarea = document.getElementById('js-html-code'); // readonly
    const jsCodeTextarea = document.getElementById('js-code');
    jsEditor = CodeMirror.fromTextArea(jsCodeTextarea, {
        mode: 'javascript',
        theme: 'darcula',
        lineNumbers: true
    });
    jsEditor.on('change', updateJSPreview);

    // Playground
    pgHtmlEditor = CodeMirror.fromTextArea(document.getElementById('playground-html-code'), {
        mode: 'htmlmixed',
        theme: 'darcula',
        lineNumbers: true
    });
    pgHtmlEditor.on('change', updatePlayground);

    pgCssEditor = CodeMirror.fromTextArea(document.getElementById('playground-css-code'), {
        mode: 'css',
        theme: 'darcula',
        lineNumbers: true
    });
    pgCssEditor.on('change', updatePlayground);

    pgJsEditor = CodeMirror.fromTextArea(document.getElementById('playground-js-code'), {
        mode: 'javascript',
        theme: 'darcula',
        lineNumbers: true
    });
    pgJsEditor.on('change', updatePlayground);

    // 初期表示
    updateHTMLPreview();
    updateCSSPreview();
    updateJSPreview();
    updatePlayground();
}

/* タブ切り替え関数 */
function switchTab(tabId, clickedTab) {
    const tabContents = clickedTab.parentElement.parentElement.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    const targetTab = document.getElementById(tabId);
    targetTab.style.display = 'block';

    const tabs = clickedTab.parentElement.querySelectorAll('a');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    clickedTab.classList.add('active');

    // 表示されたタブに対応する CodeMirror エディタがあれば refresh() を呼ぶ
    if (tabId === 'html-editor' && htmlEditor) {
        htmlEditor.refresh();
    } else if (tabId === 'css-editor' && cssEditor) {
        cssEditor.refresh();
    } else if (tabId === 'js-editor' && jsEditor) {
        jsEditor.refresh();
    } else if (tabId === 'playground-html' && pgHtmlEditor) {
        pgHtmlEditor.refresh();
    } else if (tabId === 'playground-css' && pgCssEditor) {
        pgCssEditor.refresh();
    } else if (tabId === 'playground-js' && pgJsEditor) {
        pgJsEditor.refresh();
    }

    // プレビュー更新の呼び出し
    if (tabId === 'playground-preview') {
        updatePlayground();
    } else if (tabId === 'html-preview') {
        updateHTMLPreview();
    } else if (tabId === 'css-preview') {
        updateCSSPreview();
    } else if (tabId === 'js-preview') {
        updateJSPreview();
    }
}

/* リセット関数（HTML/CSS/JS） */
function resetHTML() {
    const defaultHTML = `<h1>私のウェブページ</h1>
<p>これは<strong>HTML学習</strong>のためのページです。</p>
<ul>
  <li>項目1</li>
  <li>項目2</li>
</ul>
<a href="#">リンクをクリック</a>`;
    htmlEditor.setValue(defaultHTML);
}

function resetCSS() {
    const defaultCSS = `/* コンテナの基本スタイル */
.container {
  padding: 20px;
  background-color: #f0f0f0;
}

/* タイトルのスタイル */
.title {
  color: #4a6fa5;
  text-align: center;
}

/* テキストのスタイル */
.text {
  color: #333;
  line-height: 1.6;
}

/* ボックスのスタイル */
.box {
  background-color: #4a6fa5;
  color: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
}

/* ボタンのスタイル */
.button {
  background-color: #4a6fa5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}`;
    cssEditor.setValue(defaultCSS);
}

function resetJS() {
    const defaultJS = `// クリック時に入力内容をチェックし結果を表示する関数
function handleButtonClick() {
  const inputValue = document.getElementById('demo-input').value;
  if (inputValue.trim() === '') {
    document.getElementById('output').textContent = 'テキストを入力してください';
    document.getElementById('output').style.color = 'red';
  } else {
    document.getElementById('output').textContent = '入力値: ' + inputValue;
    document.getElementById('output').style.color = 'green';
  }
}
// イベントリスナーを追加
document.getElementById('demo-button').addEventListener('click', handleButtonClick);`;
    jsEditor.setValue(defaultJS);
}

/* プレビュー更新（HTML/CSS/JS/Playground） */
function updateHTMLPreview() {
    const code = htmlEditor.getValue();
    document.getElementById('html-result').innerHTML = code;
}

function updateCSSPreview() {
    const htmlCode = document.getElementById('css-html-code').value;
    const cssCode = cssEditor.getValue();

    const styleElement = document.createElement('style');
    styleElement.textContent = cssCode;

    const previewDoc = document.getElementById('css-result');
    previewDoc.innerHTML = htmlCode;
    previewDoc.appendChild(styleElement);
}

function updateJSPreview() {
    const htmlCode = document.getElementById('js-html-code').value;
    const jsCode = jsEditor.getValue();

    const previewDoc = document.getElementById('js-result');
    previewDoc.innerHTML = htmlCode;

    try {
        // iframeで安全に実行
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
      <html>
        <body>
          ${htmlCode}
          <script>
            ${jsCode}
          <\/script>
        </body>
      </html>
    `);
        iframeDoc.close();

        // iframe内の要素をコピーしてプレビューへ
        const iframeBody = iframeDoc.body;
        Array.from(iframeBody.children).forEach(child => {
            previewDoc.appendChild(child.cloneNode(true));
        });

        // JS実行用
        const scriptElement = document.createElement('script');
        scriptElement.textContent = jsCode;
        previewDoc.appendChild(scriptElement);

        document.body.removeChild(iframe);
    } catch (error) {
        previewDoc.innerHTML += `<div style="color: red; margin-top: 10px;">エラー: ${error.message}</div>`;
    }
}

function updatePlayground() {
    if (document.getElementById('playground-preview').style.display === 'none') {
        return;
    }
    const htmlCode = pgHtmlEditor.getValue();
    const cssCode = pgCssEditor.getValue();
    const jsCode = pgJsEditor.getValue();

    try {
        const previewArea = document.getElementById('playground-preview');
        let iframe = previewArea.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '400px';
            iframe.style.border = '1px solid #ddd';
            iframe.style.borderRadius = '4px';
            previewArea.innerHTML = '';
            previewArea.appendChild(iframe);
        }
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
      ${htmlCode.replace('</head>', '<style>' + cssCode + '</style></head>')}
      <script>${jsCode}<\/script>
    `);
        iframeDoc.close();
    } catch (error) {
        document.getElementById('playground-preview').innerHTML = `<div style="color: red; padding: 1rem;">エラー: ${error.message}</div>`;
    }
}
