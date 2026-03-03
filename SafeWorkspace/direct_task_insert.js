// Claw-Empireデータベースに直接タスクを挿入するスクリプト
const fs = require('fs');
const path = require('path');

// better-sqlite3を動的にロードしようと試みる
let Database;
try {
  // まず、node_modulesからbetter-sqlite3を探す
  const betterSqlite3Path = path.join(__dirname, 'claw-empire/node_modules/better-sqlite3');
  if (fs.existsSync(betterSqlite3Path)) {
    Database = require(betterSqlite3Path);
    console.log('better-sqlite3 found in node_modules');
  } else {
    // なければ、グローバルか別の場所を探す
    console.log('better-sqlite3 not found, trying alternative approach...');
    throw new Error('better-sqlite3 not available');
  }
} catch (err) {
  console.log('Using fallback method with child process...');
  // フォールバック: sqlite3コマンドを使う
  const { execSync } = require('child_process');
  
  const dbPath = '/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite';
  
  // まず、departmentsテーブルを確認
  console.log('Checking database structure...');
  try {
    // sqlite3コマンドが使えるか確認
    execSync('which sqlite3', { stdio: 'pipe' });
    console.log('sqlite3 command is available');
    
    // departmentsテーブルの内容を確認
    const departments = execSync(`sqlite3 "${dbPath}" "SELECT id, name FROM departments;"`, { encoding: 'utf8' });
    console.log('Existing departments:');
    console.log(departments);
    
    // consulting部門が存在するか確認
    if (departments.includes('consulting')) {
      console.log('✓ consulting department found');
    } else {
      console.log('⚠ consulting department not found, checking all departments...');
      const allDepts = execSync(`sqlite3 "${dbPath}" "SELECT * FROM departments;"`, { encoding: 'utf8' });
      console.log('All departments:', allDepts);
      
      // 最初の部門を使う
      const firstDept = allDepts.split('\n')[0];
      if (firstDept) {
        const deptId = firstDept.split('|')[0];
        console.log(`Will use department: ${deptId}`);
      }
    }
    
  } catch (cmdErr) {
    console.log('sqlite3 command not available, using file-based approach');
  }
}

// タスクデータ
const taskData = {
  id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: '次世代AIエージェントトレンド調査（CEO指示）',
  description: `CEOからの直接指示:
調査テーマ: 次世代AIエージェントの最新トレンドとビジネス応用可能性

調査目的:
1. コンサルティング部門のクライアント向けにAIエージェント技術の最新動向を把握
2. 業界別の応用可能性と導入事例を収集・分析
3. コンサルティング業務への具体的な活用方法を検討
4. クライアント提案のための材料を整備

調査範囲:
- 技術トレンド（マルチモーダルAI、自律型エージェント、エージェント間協調）
- 市場動向（主要プレイヤー、投資動向、業界別導入状況）
- ビジネス応用（コンサルティング業務への適用可能性）
- リスク分析（セキュリティ、倫理、規制）

期待成果物:
1. 調査報告書（100ページ以上）
2. プレゼンテーション資料
3. 実装ガイドライン
4. ROI分析ツール

スケジュール: 8週間（2026年3月3日〜2026年4月30日）
優先度: 高
部門: コンサルティング部門

指示者: CEO
指示日時: 2026年3月3日
指示ID: CEO-DIR-20260303-001`,
  status: 'pending',
  priority: 'high',
  department_id: 'consulting',
  created_at: Date.now(),
  updated_at: Date.now(),
  task_type: 'analysis'
};

console.log('\n=== タスク情報 ===');
console.log(`ID: ${taskData.id}`);
console.log(`タイトル: ${taskData.title}`);
console.log(`部門: ${taskData.department_id}`);
console.log(`優先度: ${taskData.priority}`);
console.log(`ステータス: ${taskData.status}`);

// 指示書ファイルの存在確認
const instructionFiles = [
  '/home/node/.openclaw/workspace/claw-empire/CEO_DIRECTIVE_AI_AGENT_TRENDS.md',
  '/home/node/.openclaw/workspace/claw-empire/TASK_CONSULTING_AI_AGENT_TRENDS.json'
];

console.log('\n=== 関連ファイル ===');
instructionFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✓ ${path.basename(file)} (${stats.size} bytes)`);
  } else {
    console.log(`⚠ ${path.basename(file)} not found`);
  }
});

console.log('\n=== 実行方法 ===');
console.log('1. sqlite3コマンドが利用可能な場合:');
console.log(`   sqlite3 "/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite" \\`);
console.log(`   "INSERT INTO tasks (id, title, description, status, priority, department_id, created_at, updated_at, task_type) VALUES ('${taskData.id}', '${taskData.title.replace(/'/g, "''")}', '${taskData.description.replace(/'/g, "''")}', '${taskData.status}', '${taskData.priority}', '${taskData.department_id}', ${taskData.created_at}, ${taskData.updated_at}, '${taskData.task_type}');"`);

console.log('\n2. Node.jsスクリプトを使用する場合:');
console.log('   better-sqlite3パッケージをインストール:');
console.log('   npm install better-sqlite3');

console.log('\n3. ファイルベースの指示:');
console.log('   作成された指示書ファイルをClaw-Empireが監視するディレクトリに配置');

console.log('\n=== 次のステップ ===');
console.log('現在の環境では、sqlite3コマンドのインストールが最も現実的です');
console.log('または、Claw-Empireサーバーの依存関係を修復します');