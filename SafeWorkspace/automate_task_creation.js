// Claw-Empire Web UI タスク作成自動化スクリプト
const fs = require('fs');
const path = require('path');

console.log('=== Claw-Empire Web UI タスク作成自動化 ===\n');

// タスクデータ
const taskData = {
  title: '次世代AIエージェントトレンド調査（CEO直接指示）',
  department: 'dept_consulting',
  priority: 'high',
  type: 'analysis',
  description: `CEO直接指示 (ID: CEO-DIR-20260303-001)

調査目的:
1. コンサルティング部門のクライアント向けにAIエージェント技術の最新動向を把握
2. 業界別の応用可能性と導入事例を収集・分析
3. コンサルティング業務への具体的な活用方法を検討
4. クライアント提案のための材料を整備

調査範囲:
- 技術トレンド: マルチモーダルAI、自律型エージェント、エージェント間協調
- 市場動向: 主要プレイヤー、投資動向、業界別導入状況
- ビジネス応用: コンサルティング業務への適用可能性
- リスク分析: セキュリティ、倫理、規制

期待成果物:
1. 調査報告書（100ページ以上）
2. プレゼンテーション資料（15-20スライド）
3. 実装ガイドライン（導入ロードマップ）
4. ROI分析ツール（スプレッドシート）

スケジュール: 8週間（2026年3月3日〜4月30日）
優先度: 高
部門: コンサルティング部門

指示者: CEO
指示日時: 2026年3月3日`,
  dueDate: '2026-04-30'
};

console.log('📋 作成するタスク情報:');
console.log(`タイトル: ${taskData.title}`);
console.log(`部門: ${taskData.department}`);
console.log(`優先度: ${taskData.priority}`);
console.log(`タイプ: ${taskData.type}`);
console.log(`期限: ${taskData.dueDate}`);
console.log(`説明の長さ: ${taskData.description.length}文字`);

// Web UIのURL
const webUIUrl = 'http://127.0.0.1:8800';

console.log('\n🌐 Web UI URL:');
console.log(webUIUrl);

// 手動操作ガイド
console.log('\n🛠️ **手動操作手順**:');
console.log('1. ブラウザで上記URLにアクセス');
console.log('2. 左メニューから「Tasks」または「カンバンボード」を選択');
console.log('3. 「New Task」ボタンをクリック');
console.log('4. 以下の情報を入力:');
console.log(`   - Title: ${taskData.title}`);
console.log(`   - Department: Consulting Firm (dept_consulting)`);
console.log(`   - Priority: High`);
console.log(`   - Type: Analysis`);
console.log(`   - Description: 上記の説明文をコピー`);
console.log(`   - Due Date: ${taskData.dueDate}`);
console.log('5. 「Create Task」ボタンをクリック');

// 自動化のためのHTML/JavaScriptコード
console.log('\n💻 **自動化用コード（開発者コンソールで実行）**:');
const autoScript = `
// タスク作成フォームを自動入力
const taskForm = document.querySelector('form[data-testid="task-form"]') || 
                 document.querySelector('form');

if (taskForm) {
  // タイトル
  const titleInput = taskForm.querySelector('input[name="title"]') || 
                     taskForm.querySelector('input[placeholder*="Title"]');
  if (titleInput) {
    titleInput.value = '${taskData.title.replace(/'/g, "\\'")}';
    titleInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  // 部門選択（コンサルティング部門）
  const deptSelect = taskForm.querySelector('select[name="department"]') || 
                     taskForm.querySelector('select[data-testid*="department"]');
  if (deptSelect) {
    for (let option of deptSelect.options) {
      if (option.text.includes('Consulting') || option.value === 'dept_consulting') {
        deptSelect.value = option.value;
        deptSelect.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }
  
  // 優先度
  const prioritySelect = taskForm.querySelector('select[name="priority"]') || 
                         taskForm.querySelector('select[data-testid*="priority"]');
  if (prioritySelect) {
    prioritySelect.value = 'high';
    prioritySelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  // 説明
  const descTextarea = taskForm.querySelector('textarea[name="description"]') || 
                       taskForm.querySelector('textarea[placeholder*="Description"]');
  if (descTextarea) {
    descTextarea.value = \`${taskData.description.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`;
    descTextarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  console.log('✅ フォームを自動入力しました');
  console.log('「Create Task」ボタンをクリックしてください');
} else {
  console.log('❌ タスクフォームが見つかりません');
  console.log('手動で作成してください');
}
`;

console.log(autoScript);

// 簡易的なcURLコマンド（APIが利用可能な場合）
console.log('\n🔧 **API経由での作成（試行）**:');
const apiCommand = `
curl -X POST http://127.0.0.1:8790/api/tasks \\
  -H "Content-Type: application/json" \\
  -H "x-inbox-secret: $(grep INBOX_WEBHOOK_SECRET /home/node/.openclaw/workspace/claw-empire/.env | cut -d= -f2 | tr -d '"')" \\
  -d '{
    "title": "${taskData.title}",
    "description": "${taskData.description.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    "department_id": "${taskData.department}",
    "priority": 2,
    "task_type": "${taskData.type}",
    "status": "pending"
  }'
`;

console.log(apiCommand);

// 最終確認
console.log('\n✅ **準備完了**:');
console.log('1. Web UI: http://127.0.0.1:8800');
console.log('2. タスク情報: 上記の通り');
console.log('3. 手順: マニュアル or 自動化スクリプト');
console.log('4. 部門: コンサルティング部門 (dept_consulting)');

console.log('\n🎯 **実行してください！**');
console.log('タスク作成後、進捗状況を監視できます。');