const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.author = '小牛助手';
pptx.title = '九年级下册物理第二章 电功率（完整版）';

const colors = { primary: '4472C4', secondary: 'ED7D31', accent: '70AD47', dark: '2F5496', light: 'D6DCE5' };

// 封面
let slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.primary } });
slide.addShape('rect', { x: 0, y: 4.3, w: '100%', h: 1.2, fill: { color: colors.dark } });
slide.addText('九年级下册物理', { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 24, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('第二章  电功率', { x: 0.5, y: 2.3, w: 9, h: 1, fontSize: 48, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('完整教学PPT', { x: 0.5, y: 4.5, w: 9, h: 0.6, fontSize: 22, color: colors.light, fontFace: 'Microsoft YaHei' });

// 目录
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: 0.3, h: '100%', fill: { color: colors.primary } });
slide.addText('目  录', { x: 0.8, y: 0.3, w: 8, h: 0.7, fontSize: 32, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
['一、电功的概念', '二、电功率的概念与计算', '三、额定功率与实际功率', '四、测量小灯泡的电功率', '五、实验电路图', '六、典型例题讲解', '七、知识点脉络图', '八、课后练习题', '九、参考答案'].forEach((t, i) => {
  slide.addText(t, { x: 1, y: 1.1 + i * 0.45, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
});

// 一、电功的概念
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('一、电功的概念', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('1. 定义', { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 19, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('电流所做的功叫做电功，也叫消耗的电能。', { x: 0.7, y: 1.4, w: 8, h: 0.35, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 公式', { x: 0.5, y: 1.85, w: 9, h: 0.4, fontSize: 19, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('W = UIt', { x: 1, y: 2.3, w: 8, h: 0.38, fontSize: 20, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });
slide.addText('U—电压（V），I—电流（A），t—时间（s）', { x: 0.7, y: 2.7, w: 8, h: 0.3, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('3. 单位', { x: 0.5, y: 3.1, w: 9, h: 0.4, fontSize: 19, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 国际单位：焦耳（J）', { x: 0.7, y: 3.5, w: 8, h: 0.3, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 常用单位：千瓦时（kW·h），俗称"度"', { x: 0.7, y: 3.85, w: 8, h: 0.3, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('1 kW·h = 3.6×10⁶ J', { x: 1, y: 4.2, w: 8, h: 0.35, fontSize: 17, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });
slide.addShape('rect', { x: 0.5, y: 4.65, w: 9, h: 0.6, fill: { color: 'E8F4FD' }, line: { color: colors.primary, width: 1 } });
slide.addText('💡 电流做功 = 电能转化为其他形式能的过程', { x: 0.65, y: 4.75, w: 8.5, h: 0.4, fontSize: 13, color: colors.dark, fontFace: 'Microsoft YaHei' });

// 二、电功率的概念
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('二、电功率的概念', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('1. 定义', { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 19, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('电流在单位时间内所做的功，表示电流做功的快慢。', { x: 0.7, y: 1.4, w: 8, h: 0.35, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 公式', { x: 0.5, y: 1.85, w: 9, h: 0.4, fontSize: 19, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('P = W/t = UI', { x: 1, y: 2.3, w: 8, h: 0.38, fontSize: 20, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });
slide.addText('P—电功率（W），W—电功（J），t—时间（s）', { x: 0.7, y: 2.7, w: 8, h: 0.3, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('3. 单位', { x: 0.5, y: 3.1, w: 9, h: 0.4, fontSize: 19, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 国际单位：瓦特（W），简称瓦', { x: 0.7, y: 3.5, w: 8, h: 0.3, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 常用单位：千瓦（kW），1 kW = 1000 W', { x: 0.7, y: 3.85, w: 8, h: 0.3, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addShape('rect', { x: 0.5, y: 4.25, w: 9, h: 0.95, fill: { color: 'FFF2CC' }, line: { color: colors.secondary, width: 1 } });
slide.addText('⚡ 物理意义：', { x: 0.65, y: 4.35, w: 8.5, h: 0.3, fontSize: 14, bold: true, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('电功率是描述电流做功快慢的物理量\n电功率越大，电流做功越快（相同时间内做功越多）', { x: 0.65, y: 4.65, w: 8.5, h: 0.5, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });

// 二、电功率计算公式
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('二、电功率的计算公式', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('公式总结', { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('① P = W/t      （定义式，普遍适用）', { x: 0.8, y: 1.45, w: 8, h: 0.35, fontSize: 16, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('② P = UI       （基本公式，普遍适用）', { x: 0.8, y: 1.85, w: 8, h: 0.35, fontSize: 16, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('③ P = I²R      （纯电阻电路）', { x: 0.8, y: 2.25, w: 8, h: 0.35, fontSize: 16, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('④ P = U²/R     （纯电阻电路）', { x: 0.8, y: 2.65, w: 8, h: 0.35, fontSize: 16, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addShape('rect', { x: 0.5, y: 3.1, w: 9, h: 0.9, fill: { color: 'FCE4EC' }, line: { color: 'E74C3C', width: 1 } });
slide.addText('⚠️ 特别提醒', { x: 0.65, y: 3.2, w: 8.5, h: 0.28, fontSize: 14, bold: true, color: 'E74C3C', fontFace: 'Microsoft YaHei' });
slide.addText('公式③④只适用于纯电阻电路（电热器、白炽灯等）\n电动机、电视机、电脑等不是纯电阻电路，只能用 P=UI', { x: 0.65, y: 3.5, w: 8.5, h: 0.45, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('公式选择技巧：', { x: 0.5, y: 4.15, w: 9, h: 0.35, fontSize: 16, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 已知 U、I → 用 P=UI', { x: 0.8, y: 4.55, w: 8, h: 0.28, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 已知 I、R → 用 P=I²R', { x: 0.8, y: 4.85, w: 8, h: 0.28, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 已知 U、R → 用 P=U²/R', { x: 0.8, y: 5.15, w: 8, h: 0.28, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });

// 三、额定功率与实际功率
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('三、额定功率与实际功率', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
const tableData = [
  [{ text: '概念', options: { bold: true, fill: { color: colors.primary }, color: 'FFFFFF' } },
   { text: '定义', options: { bold: true, fill: { color: colors.primary }, color: 'FFFFFF' } },
   { text: '备注', options: { bold: true, fill: { color: colors.primary }, color: 'FFFFFF' } }],
  ['额定电压 U额', '用电器正常工作时的电压', '标在铭牌上'],
  ['额定功率 P额', '在额定电压下的功率', 'P额 = U额×I额'],
  ['实际电压 U实', '实际工作时的电压', '可能≠U额'],
  ['实际功率 P实', '在实际电压下的功率', 'P实 = U实×I实']
];
slide.addTable(tableData, { x: 0.5, y: 1.0, w: 9, h: 1.9, fontFace: 'Microsoft YaHei', fontSize: 12, border: { color: colors.light, pt: 1 }, align: 'center', valign: 'middle' });
slide.addText('三种工作情况：', { x: 0.5, y: 3.1, w: 9, h: 0.35, fontSize: 16, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• U实 = U额 → P实 = P额 → 正常工作 ✓', { x: 0.7, y: 3.5, w: 8, h: 0.32, fontSize: 14, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('• U实 > U额 → P实 > P额 → 可能损坏 ✗', { x: 0.7, y: 3.85, w: 8, h: 0.32, fontSize: 14, color: 'E74C3C', fontFace: 'Microsoft YaHei' });
slide.addText('• U实 < U额 → P实 < P额 → 不能正常工作 ○', { x: 0.7, y: 4.2, w: 8, h: 0.32, fontSize: 14, color: '666666', fontFace: 'Microsoft YaHei' });
slide.addText('💡 实际功率随实际电压变化而变化', { x: 0.5, y: 4.65, w: 9, h: 0.35, fontSize: 14, color: colors.dark, fontFace: 'Microsoft YaHei' });

// 四、测量小灯泡电功率
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('四、测量小灯泡的电功率', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('实验原理：P = UI（伏安法）', { x: 0.5, y: 1.0, w: 9, h: 0.35, fontSize: 17, bold: true,
