// Claw-Empireにタスクを挿入する簡易スクリプト
const fs = require('fs');
const path = require('path');

// データベースパス
const dbPath = '/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite';

// タスク情報
const task = {
  id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: '次世代AIエージェントトレンド調査',
  description: `調査目的: コンサルティング部門のクライアント向けに、AIエージェント技術の最新動向を把握する

調査範囲:
1. 技術トレンド調査（マルチモーダルAI、自律型エージェント、エージェント間協調）
2. 市場動向調査（主要プレイヤー、投資動向、業界別導入状況）
3. ビジネス応用調査（コンサルティング業務への適用可能性）
4. リスク分析（セキュリティ、倫理、規制）

期待成果物:
- 調査報告書（100ページ以上）
- プレゼンテーション資料
- 実装ガイドライン
- ROI分析ツール

スケジュール: 8週間（2026年3月3日〜2026年4月30日）
優先度: 高
部門: コンサルティング部門`,
  status: 'pending',
  priority: 'high',
  department_id: 'consulting', // 部門IDを推測
  created_at: Date.now(),
  updated_at: Date.now()
};

// 指示書ファイルのパス
const instructionPath = '/home/node/.openclaw/workspace/Claw-Empire_コンサルティング部門向け指示書.md';

console.log('=== Claw-Empire タスク挿入スクリプト ===');
console.log('データベースパス:', dbPath);
console.log('タスクID:', task.id);
console.log('タスクタイトル:', task.title);
console.log('部門ID:', task.department_id);
console.log('優先度:', task.priority);
console.log('');

// データベースファイルの存在確認
if (!fs.existsSync(dbPath)) {
  console.error('エラー: データベースファイルが見つかりません:', dbPath);
  console.log('');
  console.log('代わりのアプローチ:');
  console.log('1. Claw-Empireサーバーを起動してAPI経由で指示');
  console.log('2. 指示書ファイルを作成して手動で処理');
  console.log('3. 別の連携方法を検討');
} else {
  console.log('データベースファイルを発見:', dbPath);
  console.log('ファイルサイズ:', fs.statSync(dbPath).size, 'bytes');
  console.log('');
  console.log('SQLite3コマンドを使用して手動で挿入する場合:');
  console.log('--------------------------------------------');
  console.log(`sqlite3 "${dbPath}" "`);
  console.log(`INSERT INTO tasks (id, title, description, status, priority, department_id, created_at, updated_at)`);
  console.log(`VALUES ('${task.id}', '${task.title.replace(/'/g, "''")}', '${task.description.replace(/'/g, "''")}', '${task.status}', '${task.priority}', '${task.department_id}', ${task.created_at}, ${task.updated_at});`);
  console.log(`"`);
  console.log('--------------------------------------------');
}

console.log('');
console.log('=== 指示書ファイル情報 ===');
if (fs.existsSync(instructionPath)) {
  const stats = fs.statSync(instructionPath);
  console.log('指示書ファイル:', instructionPath);
  console.log('ファイルサイズ:', stats.size, 'bytes');
  console.log('作成日時:', stats.mtime);
} else {
  console.log('指示書ファイルが存在しません:', instructionPath);
}

console.log('');
console.log('=== 次のステップ ===');
console.log('1. Claw-Empireサーバーの起動を試みる');
console.log('2. データベースを直接操作するツールをインストール');
console.log('3. 別の連携方法（API、メッセンジャー等）を検討');
console.log('');
console.log('作成したファイル:');
console.log('- Claw-Empire_コンサルティング部門向け指示書.md');
console.log('- コンサルティング部門向け_AIエージェントトレンド調査依頼書.md');
console.log('- AIエージェントトレンド概要_2026年3月.md');
console.log('- コンサルティング部門への調査依頼メール草案.md');
console.log('- AIエージェントトレンド調査_プロジェクト管理計画.md');