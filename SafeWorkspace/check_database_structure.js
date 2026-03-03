// データベース構造を確認するスクリプト
const fs = require('fs');
const path = require('path');

const dbPath = '/home/node/.openclaw/workspace/claw-empire/claw-empire.sqlite';

console.log('=== データベース構造分析 ===');
console.log(`データベース: ${dbPath}`);

if (!fs.existsSync(dbPath)) {
  console.error('❌ データベースファイルが見つかりません');
  process.exit(1);
}

const stats = fs.statSync(dbPath);
console.log(`サイズ: ${(stats.size / 1024).toFixed(1)} KB`);
console.log(`最終更新: ${stats.mtime}`);

// ファイルを直接読み込んで構造を分析
console.log('\n=== テーブル構造 ===');
const dbContent = fs.readFileSync(dbPath, 'binary');
const dbString = dbContent.toString('utf8', 0, 10000); // 最初の10KBを読み込み

// CREATE TABLE文を抽出
const createTableMatches = dbString.match(/CREATE TABLE [^;]+;/g);
if (createTableMatches) {
  console.log(`テーブル数: ${createTableMatches.length}`);
  createTableMatches.forEach((stmt, i) => {
    const tableName = stmt.match(/CREATE TABLE (\w+)/)?.[1] || 'unknown';
    console.log(`${i+1}. ${tableName}`);
  });
} else {
  console.log('CREATE TABLE文が見つかりません');
}

// departmentsテーブルの詳細を確認
console.log('\n=== departmentsテーブル分析 ===');
const deptTable = createTableMatches?.find(stmt => stmt.includes('CREATE TABLE departments'));
if (deptTable) {
  console.log('departmentsテーブル構造:');
  console.log(deptTable);
  
  // 既存の部署データを探す
  console.log('\n既存の部署データを検索...');
  const insertMatches = dbString.match(/INSERT INTO departments[^;]+;/g);
  if (insertMatches) {
    console.log(`部署データ: ${insertMatches.length}件`);
    insertMatches.forEach((stmt, i) => {
      console.log(`${i+1}. ${stmt.substring(0, 100)}...`);
    });
  } else {
    console.log('INSERT文が見つかりません。既存の部署データなし？');
  }
} else {
  console.log('departmentsテーブルが見つかりません');
}

// tasksテーブルの詳細を確認
console.log('\n=== tasksテーブル分析 ===');
const tasksTable = createTableMatches?.find(stmt => stmt.includes('CREATE TABLE tasks'));
if (tasksTable) {
  console.log('tasksテーブル構造:');
  console.log(tasksTable);
} else {
  console.log('tasksテーブルが見つかりません');
}

console.log('\n=== 次のステップ ===');
console.log('1. 既存の部署を確認する');
console.log('2. 適切なdepartment_idを決定する');
console.log('3. タスク挿入用のSQL文を作成する');

// 既存の部署をより詳細に検索
console.log('\n=== 既存データ詳細検索 ===');
const hexContent = fs.readFileSync(dbPath);
const hexString = hexContent.toString('hex');

// 部署名を探す（UTF-8文字列として）
const textDecoder = new TextDecoder('utf-8');
const buffer = hexContent;
let foundDepartments = [];

// ファイル全体からテキストを抽出
for (let i = 0; i < Math.min(buffer.length, 50000); i += 100) {
  const chunk = buffer.slice(i, i + 100);
  try {
    const text = textDecoder.decode(chunk);
    if (text.includes('planning') || text.includes('development') || text.includes('design') || 
        text.includes('qa') || text.includes('devsecops') || text.includes('operations')) {
      const lines = text.split('\n').filter(line => 
        line.includes('planning') || line.includes('development') || line.includes('design') ||
        line.includes('qa') || line.includes('devsecops') || line.includes('operations')
      );
      foundDepartments.push(...lines);
    }
  } catch (e) {
    // 無視
  }
}

if (foundDepartments.length > 0) {
  console.log('発見された部署関連テキスト:');
  const unique = [...new Set(foundDepartments)].slice(0, 10);
  unique.forEach((text, i) => {
    console.log(`${i+1}. ${text.substring(0, 80)}...`);
  });
}