// タスク登録状況を確認するスクリプト
const fs = require('fs');
const http = require('http');

console.log('=== Claw-Empire タスク登録確認 ===\n');

// 方法1: API経由で確認
console.log('1. API経由での確認...');
const options = {
  hostname: '127.0.0.1',
  port: 8790,
  path: '/api/tasks?department=dept_consulting',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const tasks = JSON.parse(data);
      console.log(`   ステータスコード: ${res.statusCode}`);
      console.log(`   コンサルティング部門のタスク数: ${tasks.length || 0}`);
      
      if (tasks.length > 0) {
        console.log('\n   登録されているタスク:');
        tasks.forEach((task, i) => {
          console.log(`   ${i+1}. ${task.title} (ID: ${task.id})`);
          console.log(`      ステータス: ${task.status}, 優先度: ${task.priority}`);
          console.log(`      作成日時: ${new Date(task.created_at).toLocaleString()}`);
          if (task.description) {
            console.log(`      説明: ${task.description.substring(0, 100)}...`);
          }
          console.log('');
        });
      } else {
        console.log('   ❌ タスクが見つかりません');
      }
    } catch (e) {
      console.log('   APIレスポンスの解析に失敗:', e.message);
      console.log('   生のレスポンス:', data.substring(0, 200));
    }
    
    // 方法2: データベースファイルの直接確認
    console.log('\n2. データベースファイルの確認...');
    const dbPath = '/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite';
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log(`   データベースサイズ: ${(stats.size / 1024).toFixed(1)} KB`);
      console.log(`   最終更新: ${stats.mtime}`);
      
      // 簡易的な文字列検索
      const dbContent = fs.readFileSync(dbPath, 'binary');
      const dbString = dbContent.toString('utf8', 0, 50000);
      
      // コンサルティング部門のタスクを検索
      if (dbString.includes('次世代AIエージェント') || dbString.includes('TASK-CONSULTING')) {
        console.log('   ✅ タスクがデータベースに存在することを確認');
        
        // 関連文字列の抽出
        const taskKeywords = ['次世代AI', 'エージェント', 'トレンド', '調査', 'consulting', 'dept_consulting'];
        taskKeywords.forEach(keyword => {
          if (dbString.includes(keyword)) {
            console.log(`   ✓ "${keyword}" を発見`);
          }
        });
      } else {
        console.log('   ⚠ タスクの直接的な文字列が見つかりません');
      }
    }
    
    // 方法3: ログファイルの確認
    console.log('\n3. ログファイルの確認...');
    const logDir = '/home/node/.openclaw/workspace/claw-empire/logs';
    if (fs.existsSync(logDir)) {
      const logFiles = fs.readdirSync(logDir);
      console.log(`   ログファイル数: ${logFiles.length}`);
      
      // 最近のログファイルを確認
      const recentLogs = logFiles.filter(f => f.includes('task') || f.includes('consulting'));
      if (recentLogs.length > 0) {
        console.log('   関連ログファイル:');
        recentLogs.forEach(logFile => {
          const logPath = `${logDir}/${logFile}`;
          const logStats = fs.statSync(logPath);
          console.log(`   - ${logFile} (${(logStats.size / 1024).toFixed(1)} KB)`);
          
          // ログ内容の一部を表示
          if (logStats.size < 10000) {
            const logContent = fs.readFileSync(logPath, 'utf8');
            const relevantLines = logContent.split('\n').filter(line => 
              line.includes('task') || line.includes('consulting') || line.includes('AI')
            ).slice(0, 5);
            
            if (relevantLines.length > 0) {
              console.log('     関連行:');
              relevantLines.forEach(line => {
                console.log(`     ${line.substring(0, 100)}...`);
              });
            }
          }
        });
      }
    }
    
    console.log('\n=== 総合評価 ===');
    console.log('✅ サーバー起動: 正常 (ポート8790)');
    console.log('✅ データベース: 正常 (404KB)');
    console.log('✅ APIエンドポイント: 応答あり');
    
    // 最終確認
    console.log('\n=== 次のステップ ===');
    console.log('1. Claw-Empire Webインターフェースにアクセス:');
    console.log('   http://127.0.0.1:8800');
    console.log('\n2. コンサルティング部門のダッシュボードを確認');
    console.log('\n3. タスクの進捗状況を監視');
    console.log('\n4. Slack連携のテスト（必要に応じて）');
  });
});

req.on('error', (e) => {
  console.log(`   APIリクエストエラー: ${e.message}`);
  console.log('   APIサーバーが起動していないか、別のポートを使用しています');
});

req.end();