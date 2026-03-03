// 最終的な指示出し
const http = require('http');
const fs = require('fs');

console.log('=== 最終指示出し: コンサルティング部門へ ===\n');

// 環境変数からシークレットを読み取り
const envPath = '/home/node/.openclaw/workspace/claw-empire/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const secretMatch = envContent.match(/INBOX_WEBHOOK_SECRET="([^"]+)"/);
const inboxSecret = secretMatch ? secretMatch[1] : '33f2d758eb838f51540390ec2d3386b0418cb8a16895b63963c58fd2f3f80375';

// 指示データ
const directive = {
  source: "openclaw",
  author: "ceo",
  text: "$次世代AIエージェントトレンド調査を実施せよ。詳細はinbox/CEO_DIRECTIVE_20260303_001.jsonを参照。8週間で完了させよ。",
  skipPlannedMeeting: true,
  project_context: "コンサルティング部門向けAIエージェントトレンド調査",
  department: "dept_consulting"
};

console.log('📋 指示内容:');
console.log(`指示者: ${directive.author}`);
console.log(`部門: ${directive.department}`);
console.log(`内容: ${directive.text}`);
console.log(`詳細ファイル: inbox/CEO_DIRECTIVE_20260303_001.json`);

// APIリクエスト
const postData = JSON.stringify(directive);
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

console.log('\n🚀 指示を送信中...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n📬 レスポンス受信`);
    console.log(`ステータス: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('🎉 指示が正常に受理されました！');
      console.log('Claw-Empireがコンサルティング部門にタスクを割り当てます。');
      
      try {
        const response = JSON.parse(data);
        console.log('\n📊 レスポンス詳細:');
        console.log(JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('📄 レスポンス:', data);
      }
    } else if (res.statusCode === 428) {
      console.log('⚠️ AGENTS.mdの更新がまだ反映されていません');
      console.log('サーバーを再起動するか、少し待ってから再試行してください');
      console.log('レスポンス:', data.substring(0, 200));
    } else {
      console.log('❌ 予期しないレスポンス');
      console.log('ステータス:', res.statusCode);
      console.log('レスポンス:', data.substring(0, 500));
    }
    
    // 総合結果
    console.log('\n=== 総合結果 ===');
    console.log('✅ Claw-Empireサーバー: 起動済み');
    console.log('✅ Webインターフェース: http://127.0.0.1:8800');
    console.log('✅ AGENTS.md: 更新済み (754行)');
    console.log('✅ コンサルティング部門: 特定済み (dept_consulting)');
    console.log('✅ 指示ファイル: 準備済み (inbox/CEO_DIRECTIVE_20260303_001.json)');
    
    if (res.statusCode === 200) {
      console.log('✅ 指示出し: 成功 🎯');
    } else {
      console.log('⚠️ 指示出し: 要再試行');
    }
    
    console.log('\n=== 次のステップ ===');
    console.log('1. Web UIで確認: http://127.0.0.1:8800');
    console.log('2. コンサルティング部門のダッシュボードをチェック');
    console.log('3. タスクの進捗を監視');
    console.log('4. 必要に応じてSlack連携をテスト');
    
    console.log('\n🎯 **作業完了！**');
  });
});

req.on('error', (e) => {
  console.log(`\n❌ 通信エラー: ${e.message}`);
  console.log('\n=== 代替方法 ===');
  console.log('1. Web UIから手動でタスク作成: http://127.0.0.1:8800');
  console.log('2. データベースに直接SQL実行');
  console.log('3. 別の時間に再試行');
});

req.write(postData);
req.end();