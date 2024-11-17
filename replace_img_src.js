const fs = require('fs');
const path = require('path');

// 你要处理的文件路径
const filePath = '批量替换.html';

// 你要替换的内容
const imgSources = [
    'https://bgm.tv/subject/398556','https://bgm.tv/subject/400216','https://bgm.tv/subject/505378','https://bgm.tv/subject/505776','https://bgm.tv/subject/464593','https://bgm.tv/subject/471793','https://bgm.tv/subject/474999','https://bgm.tv/subject/424454','https://bgm.tv/subject/440880','https://bgm.tv/subject/447954','https://bgm.tv/subject/496617','https://bgm.tv/subject/511126','https://bgm.tv/subject/481649','https://bgm.tv/subject/486347','https://bgm.tv/subject/500356','https://bgm.tv/subject/522531','https://bgm.tv/subject/473497','https://bgm.tv/subject/500840','https://bgm.tv/subject/465094','https://bgm.tv/subject/504710','https://bgm.tv/subject/463205','https://bgm.tv/subject/430699','https://bgm.tv/subject/479922','https://bgm.tv/subject/454684','https://bgm.tv/subject/371829','https://bgm.tv/subject/425355','https://bgm.tv/subject/443930','https://bgm.tv/subject/445827','https://bgm.tv/subject/455626','https://bgm.tv/subject/458596','https://bgm.tv/subject/471578','https://bgm.tv/subject/472661','https://bgm.tv/subject/479788','https://bgm.tv/subject/482301','https://bgm.tv/subject/482708','https://bgm.tv/subject/482719','https://bgm.tv/subject/484952','https://bgm.tv/subject/485469','https://bgm.tv/subject/485782','https://bgm.tv/subject/486039','https://bgm.tv/subject/487630','https://bgm.tv/subject/488177','https://bgm.tv/subject/491915','https://bgm.tv/subject/493758','https://bgm.tv/subject/494267','https://bgm.tv/subject/497909','https://bgm.tv/subject/498934','https://bgm.tv/subject/501023','https://bgm.tv/subject/501033','https://bgm.tv/subject/501205','https://bgm.tv/subject/503268','https://bgm.tv/subject/504591','https://bgm.tv/subject/506120','https://bgm.tv/subject/507581','https://bgm.tv/subject/508588','https://bgm.tv/subject/514744'以上文本按顺序填入data-link中
    // 添加更多图片 URL
];

// 读取文件并处理内容
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        return console.log('无法读取文件: ' + err);
    }

    let newContent = data;
    let imgIndex = 0;

    // 使用正则表达式按顺序替换 img 标签的 src 属性
    newContent = newContent.replace(/<img src="" alt="帖子图片">/g, () => {
        if (imgIndex < imgSources.length) {
            return `<img src="${imgSources[imgIndex++]}" alt="帖子图片">`;
        } else {
            return `<img src="" alt="帖子图片">`;
        }
    });

    fs.writeFile(filePath, newContent, 'utf8', (err) => {
        if (err) {
            return console.log('无法写入文件: ' + err);
        }
        console.log(`已处理文件: ${filePath}`);
    });
});
