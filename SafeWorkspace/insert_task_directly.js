// データベースに直接タスクを挿入する最終スクリプト
const fs = require('fs');
const { execSync, spawn } = require('child_process');

console.log('=== Claw-Empire タスク直接挿入 ===\n');

const dbPath = '/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite';
const taskId = `TASK-CONSULTING-AI-TRENDS-${Date.now()}`;
const now = Date.now();

// タスクデータ
const taskData = {
  id: taskId,
  title: '次世代AIエージェントトレンド調査（CEO直接指示）',
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
部門: コンサルティング部門 (dept_consulting)

指示者: CEO
指示日時: 2026年3月3日
指示ID: CEO-DIR-20260303-001

詳細は同梱の指示書ファイルを参照:
- CEO_DIRECTIVE_AI_AGENT_TRENDS.md
- TASK_CONSULTING_AI_AGENT_TRENDS.json
- inbox/CEO_DIRECTIVE_20260303_001.json`,
  status: 'pending',
  priority: 2, // high = 2, medium = 1, low = 0
  department_id: 'dept_consulting',
  task_type: 'analysis',
  created_at: now,
  updated_at: now
};

console.log('タスク情報:');
console.log(`ID: ${taskData.id}`);
console.log(`タイトル: ${taskData.title}`);
console.log(`部門ID: ${taskData.department_id}`);
console.log(`優先度: ${taskData.priority} (2=高)`);
console.log(`ステータス: ${taskData.status}`);
console.log(`作成日時: ${new Date(taskData.created_at).toISOString()}`);

// SQL文の生成
const sql = `
INSERT INTO tasks (
  id, title, description, status, priority, 
  department_id, task_type, created_at, updated_at
) VALUES (
  '${taskData.id.replace(/'/g, "''")}',
  '${taskData.title.replace(/'/g, "''")}',
  '${taskData.description.replace(/'/g, "''")}',
  '${taskData.status}',
  ${taskData.priority},
  '${taskData.department_id}',
  '${taskData.task_type}',
  ${taskData.created_at},
  ${taskData.updated_at}
);
`;

console.log('\n生成されたSQL文:');
console.log(sql);

// 実行方法の提示
console.log('\n=== 実行方法 ===');

// 方法1: sqlite3コマンドが利用可能な場合
console.log('\n1. sqlite3コマンドを使用:');
console.log(`echo "${sql}" | sqlite3 "${dbPath}"`);

// 方法2: Node.jsで実行（better-sqlite3がインストールされている場合）
console.log('\n2. Node.jsスクリプトを使用:');
console.log(`const Database = require('better-sqlite3');`);
console.log(`const db = new Database('${dbPath}');`);
console.log(`db.exec(\`${sql.replace(/'/g, "\\'")}\`);`);
console.log(`db.close();`);

// 方法3: 簡易ファイル出力
console.log('\n3. SQLファイルを作成して後で実行:');
const sqlFile = '/home/node/.openclaw/workspace/insert_task.sql';
fs.writeFileSync(sqlFile, sql);
console.log(`SQLファイルを作成: ${sqlFile}`);
console.log(`後で実行: sqlite3 "${dbPath}" < "${sqlFile}"`);

// 方法4: 手動コピー用
console.log('\n4. 手動コピー用（クリップボードにコピー）:');
console.log('--- コピー開始 ---');
console.log(sql);
console.log('--- コピー終了 ---');

console.log('\n=== 確認事項 ===');
console.log('1. 部門ID "dept_consulting" がdepartmentsテーブルに存在することを確認済み');
console.log('2. tasksテーブルが存在することを確認済み');
console.log('3. 優先度: 2 = 高（0=低, 1=中, 2=高）');
console.log('4. ステータス: pending = 保留中（inboxに表示される）');

console.log('\n=== 次のアクション ===');
console.log('1. 上記のSQL文を実行してタスクを挿入');
console.log('2. Claw-Empireサーバーの依存関係問題をClaude Codeに修正依頼');
console.log('3. タスクが正常に挿入されたら確認メッセージを送信');

// 既存の指示ファイルの確認
console.log('\n=== 既存の指示ファイル ===');
const instructionFiles = [
  '/home/node/.openclaw/workspace/claw-empire/inbox/CEO_DIRECTIVE_20260303_001.json',
  '/home/node/.openclaw/workspace/claw-empire/CEO_DIRECTIVE_AI_AGENT_TRENDS.md',
  '/home/node/.openclaw/workspace/claw-empire/TASK_CONSULTING_AI_AGENT_TRENDS.json'
];

instructionFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✓ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`⚠ ${file} (見つかりません)`);
  }
});