#!/bin/bash
echo "=== Claw-Empire 起動スクリプト ==="
echo "ディレクトリ: /home/node/.openclaw/workspace/claw-empire"
echo ""

cd /home/node/.openclaw/workspace/claw-empire

echo "1. 依存関係の確認..."
if [ -f "package.json" ]; then
    echo "  package.json を発見"
    
    # 簡易的な依存関係チェック
    if [ -d "node_modules" ]; then
        echo "  node_modules ディレクトリが存在します"
        NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
        echo "  サイズ: $NODE_MODULES_SIZE"
    else
        echo "  ⚠️ node_modules ディレクトリが存在しません"
        echo "  依存関係をインストールする必要があります"
    fi
else
    echo "  ❌ package.json が見つかりません"
    exit 1
fi

echo ""
echo "2. 環境設定の確認..."
if [ -f ".env" ]; then
    echo "  .env ファイルを発見"
    INBOX_SECRET=$(grep INBOX_WEBHOOK_SECRET .env | cut -d= -f2)
    if [ -n "$INBOX_SECRET" ]; then
        echo "  INBOX_WEBHOOK_SECRET: 設定済み"
    else
        echo "  ⚠️ INBOX_WEBHOOK_SECRET が設定されていません"
    fi
else
    echo "  ⚠️ .env ファイルが見つかりません"
    echo "  .env.example をコピーして設定してください"
fi

echo ""
echo "3. データベースの確認..."
if [ -f "claw-empire.sqlite" ]; then
    DB_SIZE=$(du -h claw-empire.sqlite | cut -f1)
    echo "  データベースファイルを発見: $DB_SIZE"
    
    # 簡易的なテーブル確認
    echo "  データベース構造:"
    strings claw-empire.sqlite | grep "CREATE TABLE" | head -10
else
    echo "  ❌ データベースファイルが見つかりません"
fi

echo ""
echo "4. サーバー起動の試行..."
echo "  現在のプロセス確認:"
ps aux | grep -E "(8790|8800|nodemon|vite)" | grep -v grep || echo "  起動中のClaw-Empireプロセスはありません"

echo ""
echo "5. 作成された指示ファイル:"
ls -la CEO_DIRECTIVE_AI_AGENT_TRENDS.md TASK_CONSULTING_AI_AGENT_TRENDS.json 2>/dev/null || echo "  指示ファイルが見つかりません"

echo ""
echo "=== 次のステップ ==="
echo "1. 依存関係のインストール:"
echo "   cd /home/node/.openclaw/workspace/claw-empire"
echo "   CI=true pnpm install"
echo ""
echo "2. 開発サーバーの起動:"
echo "   pnpm dev:local"
echo ""
echo "3. APIエンドポイントへの指示送信:"
echo "   curl -X POST http://127.0.0.1:8790/api/inbox \\"
echo "     -H 'content-type: application/json' \\"
echo "     -H 'x-inbox-secret: YOUR_INBOX_SECRET' \\"
echo "     -d '{\"source\":\"openclaw\",\"author\":\"ceo\",\"text\":\"$次世代AIエージェントトレンド調査を実施せよ\",\"skipPlannedMeeting\":true}'"
echo ""
echo "4. ブラウザで確認:"
echo "   http://127.0.0.1:8800 (フロントエンド)"
echo "   http://127.0.0.1:8790/healthz (APIヘルスチェック)"
echo ""
echo "=== 作成されたファイル一覧 ==="
echo "- CEO_DIRECTIVE_AI_AGENT_TRENDS.md (CEO指示書)"
echo "- TASK_CONSULTING_AI_AGENT_TRENDS.json (タスク定義)"
echo "- Claw-Empire_コンサルティング部門向け指示書.md (詳細指示書)"
echo "- コンサルティング部門向け_AIエージェントトレンド調査依頼書.md"
echo "- AIエージェントトレンド概要_2026年3月.md"
echo "- コンサルティング部門への調査依頼メール草案.md"
echo "- AIエージェントトレンド調査_プロジェクト管理計画.md"