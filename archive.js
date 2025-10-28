import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Параметры
const distFolder = 'dist';
const rootName = path.basename(process.cwd());

// Получение сегодняшней даты в формате дд-мм-гггг
const now = new Date();
const dd = String(now.getDate()).padStart(2, '0');
const mm = String(now.getMonth() + 1).padStart(2, '0'); // Месяц +1, т.к. от 0
const yyyy = now.getFullYear();
const todayDate = `${dd}-${mm}-${yyyy}`;

// Регулярка поиска версии архивов с текущей датой
const baseNamePattern = new RegExp(
  `^dist-${rootName}-${todayDate}-v(\\d+)\\.zip$`,
);

const files = fs.readdirSync(process.cwd());

// Получаем все версии архивов с сегодняшней датой
const versions = files
  .map((f) => {
    const match = f.match(baseNamePattern);
    return match ? parseInt(match[1], 10) : 0;
  })
  .filter((v) => v > 0);

const maxVersion = versions.length > 0 ? Math.max(...versions) : 0;
const nextVersion = maxVersion + 1;

const archiveName = `dist-${rootName}-${todayDate}-v${nextVersion}.zip`;

const distPath = path.join(process.cwd(), distFolder);

try {
  execSync(
    `powershell Compress-Archive -Path ${distPath}\\* -DestinationPath ${archiveName}`,
    { stdio: 'inherit' },
  );
  console.log(`Архив создан: ${archiveName}`);
} catch (error) {
  console.error('Ошибка при архивировании:', error);
}
