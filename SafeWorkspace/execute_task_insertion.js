// openclaw_to_empire.mjsを修正して実行
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Claw-Empire タスク挿入実行 ===\n');

// スクリプトの修正
const originalScript = path.join(__dirname, 'claw-empire/scripts/openclaw_to_empire.mjs');
const fixedScript = path.join(__dirname, 'claw-empire/scripts/openclaw_to_empire_fixed.mjs');

// データベースパスを修正
let scriptContent = fs.readFileSync(originalScript, 'utf8');
scriptContent = scriptContent.replace(
  "const dbPath = 'c:/Users/user/Openclaw/SafeWorkspace/claw-empire/claw-empire.sqlite';",
  "const dbPath = '/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite';"
);

fs.writeFileSync(fixedScript, scriptContent);
console.log('✅ スクリプトを修正しました');

// タスク情報
const departmentId = 'dept_consulting';
const taskTitle = '次世代AIエージェントトレンド調査（CEO指示 v2）';
const taskDescription = `CEO直接指示 (ID: CEO-DIR-20260303-001-v2)

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
指示日時: 2026年3月3日`;

console.log('\n✅ タスク情報を準備しました:');
console.log(`部門: ${departmentId}`);
console.log(`タイトル: ${taskTitle}`);
console.log(`説明: ${taskDescription.substring(0, 100)}...`);

// スクリプト実行
try {
  console.log('\n🚀 スクリプトを実行中...');
  const result = execSync(
    `node "${fixedScript}" "${departmentId}" "${taskTitle}" "${taskDescription}"`,
    { encoding: 'utf8', stdio: 'pipe' }
  );
  console.log('✅ 実行結果:');
  console.log(result);
} catch (error) {
  console.log('❌ 実行エラー:');
  console.log(error.message);
  console.log('stderr:', error.stderr);
  console.log('stdout:', error.stdout);
  
  // 代替方法: 直接SQL実行
  console.log('\n🔄 代替方法: 直接SQL実行を試みます...');
  
  const sql = `
INSERT INTO tasks (
  id, title, description, status, priority, department_id, created_at, updated_at, task_type
) VALUES (
  'task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}',
  '${taskTitle.replace(/'/g, "''")}',
  '${taskDescription.replace(/'/g, "''")}',
  'pending',
  2,
  'dept_consulting',
  ${Date.now()},
  ${Date.now()},
  'analysis'
);`;

  const sqlFile = path.join(__dirname, 'insert_task_direct.sql');
  fs.writeFileSync(sqlFile, sql);
  console.log(`✅ SQLファイルを作成: ${sqlFile}`);
  console.log('\n📋 実行するSQL文:');
  console.log(sql);
  
  console.log('\n💡 実行方法:');
  console.log(`1. sqlite3が利用可能な場合:`);
  console.log(`   sqlite3 "/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite" "${sql}"`);
  console.log(`\n2. Node.jsで実行:`);
  console.log(`   const sqlite3 = require('sqlite3');`);
  console.log(`   const db = new sqlite3.Database('${path.join(__dirname, 'claw-empire/claw-empire.sqlite')}');`);
  console.log(`   db.run(\`${sql.replace(/'/g, "\\'")}\`, (err) => {`);
  console.log(`     if (err) console.error(err);`);
  console.log(`     else console.log('タスクを登録しました');`);
  console.log(`   });`);
}

// Webインターフェースの確認
console.log('\n=== Webインターフェース確認 ===');
console.log('Claw-Empire Web UI: http://127.0.0.1:8800');
console.log('API ヘルスチェック: http://127.0.0.1:8790/healthz');

console.log('\n=== 次のステップ ===');
console.log('1. Webインターフェースにアクセスしてタスクを確認');
console.log('2. コンサルティング部門のダッシュボードをチェック');
console.log('3. タスクの進捗状況を監視');
console.log('4. 必要に応じてSlack連携をテスト');