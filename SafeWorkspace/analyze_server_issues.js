// サーバー起動問題の分析
const fs = require('fs');
const path = require('path');

console.log('=== Claw-Empire サーバー起動問題分析 ===\n');

const clawEmpireDir = '/home/node/.openclaw/workspace/claw-empire';

// 1. package.jsonの確認
console.log('1. package.jsonの確認');
const packageJson = JSON.parse(fs.readFileSync(path.join(clawEmpireDir, 'package.json'), 'utf8'));
console.log(`   バージョン: ${packageJson.version}`);
console.log(`   メインスクリプト: ${packageJson.main || 'index.ts'}`);
console.log(`   スクリプト数: ${Object.keys(packageJson.scripts || {}).length}`);

// 2. 依存関係の確認
console.log('\n2. 依存関係の確認');
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};
console.log(`   総依存関係数: ${Object.keys(dependencies).length}`);

// 重要な依存関係の確認
const criticalDeps = ['express', 'concurrently', 'nodemon', 'vite', 'typescript', 'better-sqlite3'];
console.log('   重要な依存関係:');
criticalDeps.forEach(dep => {
  const version = dependencies[dep];
  console.log(`   ${dep}: ${version || '❌ 未インストール'}`);
});

// 3. node_modulesの確認
console.log('\n3. node_modulesの確認');
const nodeModulesPath = path.join(clawEmpireDir, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const nodeModulesSize = fs.readdirSync(nodeModulesPath).length;
  console.log(`   ディレクトリ存在: ✓`);
  console.log(`   パッケージ数: ${nodeModulesSize}`);
  
  // 重要なパッケージの存在確認
  console.log('   重要なパッケージの存在確認:');
  criticalDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    console.log(`   ${dep}: ${fs.existsSync(depPath) ? '✓' : '❌'}`);
  });
} else {
  console.log('   ❌ node_modulesディレクトリが存在しません');
}

// 4. サーバーファイルの確認
console.log('\n4. サーバーファイルの確認');
const serverDir = path.join(clawEmpireDir, 'server');
if (fs.existsSync(serverDir)) {
  const serverFiles = fs.readdirSync(serverDir);
  console.log(`   サーバーディレクトリ: ✓ (${serverFiles.length}ファイル)`);
  
  const indexFile = path.join(serverDir, 'index.ts');
  if (fs.existsSync(indexFile)) {
    const content = fs.readFileSync(indexFile, 'utf8').substring(0, 500);
    console.log(`   メインファイル(index.ts): ✓`);
    console.log(`   内容の先頭: ${content.substring(0, 100)}...`);
  } else {
    console.log('   ❌ server/index.tsが見つかりません');
  }
} else {
  console.log('   ❌ serverディレクトリが存在しません');
}

// 5. 環境設定の確認
console.log('\n5. 環境設定の確認');
const envFile = path.join(clawEmpireDir, '.env');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const hasInboxSecret = envContent.includes('INBOX_WEBHOOK_SECRET');
  const hasPort = envContent.includes('PORT=');
  console.log(`   .envファイル: ✓`);
  console.log(`   INBOX_WEBHOOK_SECRET: ${hasInboxSecret ? '✓' : '❌'}`);
  console.log(`   PORT設定: ${hasPort ? '✓' : '❌'}`);
} else {
  console.log('   ❌ .envファイルが存在しません');
}

// 6. 起動スクリプトの確認
console.log('\n6. 起動スクリプトの確認');
const devScript = packageJson.scripts?.['dev:local'];
if (devScript) {
  console.log(`   dev:localスクリプト: ✓`);
  console.log(`   内容: ${devScript}`);
  
  // スクリプトの解析
  if (devScript.includes('concurrently')) {
    console.log('   使用ツール: concurrently');
  }
  if (devScript.includes('vite')) {
    console.log('   フロントエンド: Vite');
  }
  if (devScript.includes('nodemon')) {
    console.log('   バックエンド: Node.js + nodemon');
  }
} else {
  console.log('   ❌ dev:localスクリプトが定義されていません');
}

// 7. 問題の特定
console.log('\n7. 問題の特定と解決策');
console.log('\n可能性のある問題:');
console.log('1. concurrentlyの実行権限問題');
console.log('   → concurrentlyがグローバルにインストールされていない');
console.log('   → node_modules/.bin/にシンボリックリンクがない');

console.log('\n2. 依存関係の不完全なインストール');
console.log('   → pnpm installが完全に成功していない');
console.log('   → ネットワーク問題による部分的なインストール');

console.log('\n3. TypeScriptコンパイル問題');
console.log('   → tsx/nodemonの設定問題');
console.log('   → TypeScript設定ファイルの問題');

console.log('\n4. ポートの競合');
console.log('   → ポート8790/8800が既に使用中');

console.log('\n推奨される解決策:');
console.log('1. 依存関係の再インストール');
console.log('   rm -rf node_modules pnpm-lock.yaml');
console.log('   pnpm install');

console.log('\n2. 個別のサーバー起動');
console.log('   # バックエンドのみ起動');
console.log('   cd server && npx tsx index.ts');
console.log('   # フロントエンドのみ起動');
console.log('   npx vite --host 127.0.0.1 --port 8800');

console.log('\n3. 簡易起動スクリプトの作成');
console.log('   concurrentlyの代わりに個別プロセスで起動');

console.log('\n4. Docker環境の確認');
console.log('   → 必要なポートが公開されているか');
console.log('   → 十分なメモリ/CPUが割り当てられているか');

console.log('\n=== 次のステップ ===');
console.log('1. まずはタスクをデータベースに直接挿入（今すぐ可能）');
console.log('2. サーバー問題はClaude Codeに修正を依頼');