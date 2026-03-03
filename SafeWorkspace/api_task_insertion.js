// Claw-Empire API経由でタスクを登録
const http = require('http');

console.log('=== Claw-Empire API経由タスク登録 ===\n');

// INBOX_WEBHOOK_SECRETを.envから読み取る
const fs = require('fs');
const envPath = '/home/node/.openclaw/workspace/claw-empire/.env';
let inboxSecret = '33f2d758eb838f51540390ec2d3386b0418cb8a16895b63963c58fd2f3f80375'; // デフォルト値

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/INBOX_WEBHOOK_SECRET="([^"]+)"/);
  if (match) {
    inboxSecret = match[1];
    console.log(`✅ INBOX_WEBHOOK_SECRETを読み取りました`);
  }
}

const taskData = {
  source: "openclaw",
  author: "ceo",
  text: "$次世代AIエージェントトレンド調査を実施せよ。詳細はinbox/CEO_DIRECTIVE_20260303_001.jsonを参照。",
  skipPlannedMeeting: true,
  project_context: "コンサルティング部門向けAIエージェントトレンド調査"
};

console.log('送信データ:');
console.log(JSON.stringify(taskData, null, 2));

const postData = JSON.stringify(taskData);

const options = {
  hostname: '127.0.0.1',
  port: 8790,
  path: '/api/inbox',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'x-inbox-secret': inboxSecret
  }
};

console.log('\n🚀 APIリクエスト送信中...');
console.log(`URL: http://${options.hostname}:${options.port}${options.path}`);
console.log(`Secret: ${inboxSecret.substring(0, 10)}...`);

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n✅ レスポンス受信`);
    console.log(`ステータスコード: ${res.statusCode}`);
    console.log(`レスポンスヘッダ:`, res.headers);
    
    try {
      const jsonResponse = JSON.parse(data);
      console.log(`レスポンスボディ:`);
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n🎉 タスク登録成功！');
        console.log('Claw-Empireが指示を受け取り、コンサルティング部門に割り当てます。');
      } else {
        console.log('\n⚠ 予期しないレスポンス');
      }
    } catch (e) {
      console.log(`生のレスポンス: ${data}`);
    }
    
    // 次のステップ
    console.log('\n=== 次のステップ ===');
    console.log('1. Webインターフェースで確認: http://127.0.0.1:8800');
    console.log('2. コンサルティング部門のタスクを確認');
    console.log('3. 進捗状況を監視');
    
    // 代替方法の提示
    if (res.statusCode !== 200) {
      console.log('\n🔄 代替方法:');
      console.log('1. Webインターフェースから手動でタスク作成');
      console.log('2. データベースに直接SQLを実行');
      console.log('3. 別のスクリプトを使用');
    }
  });
});

req.on('error', (e) => {
  console.log(`\n❌ リクエストエラー: ${e.message}`);
  console.log('\n=== トラブルシューティング ===');
  console.log('1. サーバーが起動しているか確認:');
  console.log('   curl -s http://127.0.0.1:8790/healthz');
  console.log('\n2. INBOX_WEBHOOK_SECRETが正しいか確認:');
  console.log(`   現在のsecret: ${inboxSecret.substring(0, 10)}...`);
  console.log('\n3. ポートが正しいか確認:');
  console.log('   フロントエンド: http://127.0.0.1:8800');
  console.log('   バックエンド: http://127.0.0.1:8790');
  console.log('\n4. 手動でWebインターフェースからタスク作成');
});

req.write(postData);
req.end();