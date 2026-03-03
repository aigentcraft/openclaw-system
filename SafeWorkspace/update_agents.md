# AGENTS.md更新スクリプトの実行結果

## 現在の状況：
1. ✅ Claw-Empireサーバー起動済み
2. ✅ コンサルティング部門特定済み（dept_consulting）
3. ⚠️ AGENTS.mdのバージョンが古い（428エラー）
4. ⚠️ 権限問題で自動更新スクリプトが実行できない

## 手動更新手順：

### ステップ1: 現在のAGENTS.mdをバックアップ
```bash
cp /home/node/.openclaw/workspace/AGENTS.md /home/node/.openclaw/workspace/AGENTS.md.backup
```

### ステップ2: Claw-Empireルールを追加
以下の内容をAGENTS.mdの**先頭**に追加：

```markdown
<!-- BEGIN claw-empire orchestration rules -->
# Claw-Empire Orchestration Rules

> This section was added by Claw-Empire setup (`pnpm setup`).
> It defines how the AI agent handles CEO directives and task orchestration.
> Place this at the TOP of your AGENTS.md so it takes priority.

---（以下、templates/AGENTS-empire.mdの内容を追加）---
```

### ステップ3: 簡易的な統合スクリプト
```bash
#!/bin/bash
# AGENTS.mdを手動で更新
BACKUP_FILE="/home/node/.openclaw/workspace/AGENTS.md.backup.$(date +%Y%m%d_%H%M%S)"
TEMPLATE_FILE="/home/node/.openclaw/workspace/claw-empire/templates/AGENTS-empire.md"
CURRENT_AGENTS="/home/node/.openclaw/workspace/AGENTS.md"

# バックアップ
cp "$CURRENT_AGENTS" "$BACKUP_FILE"
echo "✅ バックアップ作成: $BACKUP_FILE"

# 新しいAGENTS.mdを作成
cat "$TEMPLATE_FILE" > /tmp/new_agents.md
echo "" >> /tmp/new_agents.md
echo "---" >> /tmp/new_agents.md
echo "" >> /tmp/new_agents.md
cat "$CURRENT_AGENTS" >> /tmp/new_agents.md

# 置き換え
cp /tmp/new_agents.md "$CURRENT_AGENTS"
echo "✅ AGENTS.mdを更新しました"
echo "   サイズ: $(wc -l < "$CURRENT_AGENTS")行"
```

## GitHub共有に関する注意点（再確認）：
1. **`.env`ファイルは絶対にコミットしない** - シークレット情報を含む
2. **`claw-empire.sqlite`はコミットしない** - データベースファイル
3. **`node_modules`はコミットしない** - .gitignoreに追加済みか確認
4. **個人情報を含むファイルは除外** - 設定ファイルを確認

## 次のアクション：
1. **手動でAGENTS.mdを更新**（上記スクリプトを実行）
2. **API経由で指示を再送信**
3. **Web UIで確認**: http://127.0.0.1:8800

## 実行コマンド：
```bash
# 1. バックアップ
cp /home/node/.openclaw/workspace/AGENTS.md /home/node/.openclaw/workspace/AGENTS.md.backup

# 2. 統合（手動）
cat /home/node/.openclaw/workspace/claw-empire/templates/AGENTS-empire.md > /tmp/agents_new.md
echo -e "\n---\n" >> /tmp/agents_new.md
cat /home/node/.openclaw/workspace/AGENTS.md >> /tmp/agents_new.md
cp /tmp/agents_new.md /home/node/.openclaw/workspace/AGENTS.md

# 3. 確認
echo "更新完了: $(wc -l < /home/node/.openclaw/workspace/AGENTS.md)行"
```

**この更新を実行しますか？** 実行すれば、Claw-Empireへの指示出しが可能になります！