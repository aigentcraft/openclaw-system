cd /home/node/.openclaw/workspace/claw-empire
npx -y sqlite3@latest ./claw-empire.sqlite "INSERT INTO tasks (id, title, description, status, priority, department_id, task_type, created_at, updated_at) VALUES ('TASK-CONSULTING-AI-TRENDS-1772519438138', '次世代AIエージェントトレンド調査（CEO直接指示）', 'CEO直接指示...（詳細は上記参照）', 'pending', 2, 'dept_consulting', 'analysis', 1772519438138, 1772519438138);"

rm -rf node_modules pnpm-lock.yaml
CI=true pnpm install
chmod +x node_modules/.bin/*
