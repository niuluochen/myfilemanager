const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.author = '小牛助手';
pptx.title = '九年级下册物理第二章 电功率（完整版）';

const colors = { primary: '4472C4', secondary: 'ED7D31', accent: '70AD47', dark: '2F5496', light: 'D6DCE5' };

// ===== 封面 =====
let slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.primary } });
slide.addShape('rect', { x: 0, y: 4.3, w: '100%', h: 1.2, fill: { color: colors.dark } });
slide.addText('九年级下册物理', { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 24, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('第二章  电功率', { x: 0.5, y: 2.3, w: 9, h: 1, fontSize: 48, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('完整教学PPT', { x: 0.5, y: 4.5, w: 9, h: 0.6, fontSize: 22, color: colors.light, fontFace: 'Microsoft YaHei' });

// ===== 目录 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: 0.3, h: '100%', fill: { color: colors.primary } });
slide.addText('目  录', { x: 0.8, y: 0.3, w: 8, h: 0.7, fontSize: 32, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
['一、电功的概念', '二、电功率的概念与计算', '三、额定功率与实际功率', '四、测量小灯泡的电功率', '五、实验电路图', '六、典型例题讲解', '七、知识点脉络图', '八、课后练习题', '九、参考答案'].forEach((t, i) => {
  slide.addText(t, { x: 1, y: 1.1 + i * 0.45, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
});

// ===== 一、电功的概念 =====
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

// ===== 二、电功率的概念 =====
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
slide.addText('⚡ 物理意义：电功率是描述电流做功快慢的物理量', { x: 0.65, y: 4.35, w: 8.5, h: 0.35, fontSize: 14, bold: true, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('电功率越大，电流做功越快（相同时间内做功越多）', { x: 0.65, y: 4.75, w: 8.5, h: 0.35, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 二、电功率计算公式 =====
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
slide.addText('公式③④只适用于纯电阻电路（电热器、白炽灯等）', { x: 0.65, y: 3.5, w: 8.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('电动机、电视机、电脑等不是纯电阻电路，只能用 P=UI', { x: 0.65, y: 3.8, w: 8.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('公式选择技巧：', { x: 0.5, y: 4.15, w: 9, h: 0.35, fontSize: 16, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 已知 U、I → 用 P=UI    • 已知 I、R → 用 P=I²R    • 已知 U、R → 用 P=U²/R', { x: 0.7, y: 4.55, w: 8, h: 0.35, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });

module.exports = { pptx, colors, PptxGenJS };

// ===== 三、额定功率与实际功率 =====
let slide = pptx.addSlide();
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

// ===== 四、测量小灯泡电功率 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('四、测量小灯泡的电功率', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('实验原理：P = UI（伏安法）', { x: 0.5, y: 1.0, w: 9, h: 0.35, fontSize: 17, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('实验器材：电源、小灯泡(2.5V)、电压表、电流表、滑动变阻器、开关、导线', { x: 0.5, y: 1.45, w: 9, h: 0.32, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('实验步骤：', { x: 0.5, y: 1.9, w: 9, h: 0.35, fontSize: 16, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('1. 连接电路，滑片置于阻值最大处', { x: 0.7, y: 2.3, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 闭合开关，调节滑片使U=U额，记录数据', { x: 0.7, y: 2.6, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('3. 计算 P额 = U额 × I额', { x: 0.7, y: 2.9, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('4. 调节滑片使U略高于/低于U额，观察现象', { x: 0.7, y: 3.2, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addShape('rect', { x: 0.5, y: 3.6, w: 9, h: 0.85, fill: { color: 'E8F4FD' }, line: { color: colors.primary, width: 1 } });
slide.addText('⚠️ 滑动变阻器的作用：', { x: 0.65, y: 3.7, w: 8.5, h: 0.28, fontSize: 13, bold: true, color: colors.primary, fontFace: 'Microsoft YaHei' });
slide.addText('① 改变小灯泡两端电压  ② 保护电路', { x: 0.65, y: 4.0, w: 8.5, h: 0.28, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('闭合开关前，滑片必须移到阻值最大处！', { x: 0.65, y: 4.3, w: 8.5, h: 0.28, fontSize: 12, color: colors.secondary, fontFace: 'Microsoft YaHei' });

// ===== 五、实验电路图 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('五、实验电路图', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('测量小灯泡电功率的电路图', { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
// 电路图描述
slide.addShape('rect', { x: 1.5, y: 1.6, w: 7, h: 2.8, fill: { color: 'F5F5F5' }, line: { color: 'CCCCCC', width: 1 } });
slide.addText('电路连接要点：', { x: 1.7, y: 1.7, w: 6.5, h: 0.35, fontSize: 14, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 电源、开关、滑动变阻器、小灯泡、电流表串联', { x: 1.7, y: 2.1, w: 6.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 电压表与小灯泡并联', { x: 1.7, y: 2.4, w: 6.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 电流表"正进负出"，选择合适量程', { x: 1.7, y: 2.7, w: 6.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 电压表"正进负出"，量程0-3V', { x: 1.7, y: 3.0, w: 6.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 滑动变阻器"一上一下"接入电路', { x: 1.7, y: 3.3, w: 6.5, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('电路符号示意：', { x: 0.5, y: 4.6, w: 9, h: 0.35, fontSize: 14, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('[电源] — [开关] — [电流表] — [滑动变阻器] — [小灯泡] — 回到电源', { x: 0.7, y: 5.0, w: 8, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('[电压表] 并联在小灯泡两端', { x: 0.7, y: 5.35, w: 8, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 六、典型例题讲解 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('六、典型例题讲解', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('例题1：计算题', { x: 0.5, y: 1.0, w: 9, h: 0.35, fontSize: 17, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('一个标有"220V 100W"的灯泡，正常工作时：', { x: 0.7, y: 1.4, w: 8, h: 0.32, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（1）通过灯泡的电流是多少？', { x: 0.9, y: 1.75, w: 7, h: 0.28, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（2）灯泡的电阻是多少？', { x: 0.9, y: 2.05, w: 7, h: 0.28, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（3）若接在110V电压下，实际功率是多少？', { x: 0.9, y: 2.35, w: 7, h: 0.28, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addShape('rect', { x: 0.5, y: 2.75, w: 9, h: 2.5, fill: { color: 'E8F4FD' }, line: { color: colors.primary, width: 1 } });
slide.addText('【解答】', { x: 0.65, y: 2.85, w: 8.5, h: 0.32, fontSize: 14, bold: true, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('（1）I = P/U = 100W ÷ 220V ≈ 0.45A', { x: 0.65, y: 3.2, w: 8.5, h: 0.28, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（2）R = U²/P = 220²÷100 = 484Ω', { x: 0.65, y: 3.5, w: 8.5, h: 0.28, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（3）P实 = U实²/R = 110²÷484 = 25W', { x: 0.65, y: 3.8, w: 8.5, h: 0.28, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('【结论】电压减半，功率变为原来的1/4', { x: 0.65, y: 4.15, w: 8.5, h: 0.28, fontSize: 12, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });

// 例题2
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.85, fill: { color: colors.primary } });
slide.addText('六、典型例题讲解', { x: 0.5, y: 0.18, w: 9, h: 0.55, fontSize: 25, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('例题2：比较功率', { x: 0.5, y: 1.0, w: 9, h: 0.35, fontSize: 17, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('将两电阻R1和R2串联接在电路中，R1=10Ω，R2=20Ω，', { x: 0.7, y: 1.4, w: 8, h: 0.32, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('求两电阻消耗功率之比 P1:P2 = ?', { x: 0.7, y: 1.75, w: 8, h: 0.28, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addShape('rect', { x: 0.5, y: 2.15, w: 9, h: 1.5, fill: { color: 'E8F4FD' }, line: { color: colors.primary, width: 1 } });
slide.addText('【解答】', { x: 0.65, y: 2.25, w: 8.5, h: 0.32, fontSize: 14, bold: true, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('串联电路中，电流相同', { x: 0.65, y: 2.6, w: 8.5, h: 0.28, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('P = I²R，所以 P ∝ R', { x: 0.65, y: 2.9, w: 8.5, h: 0.28, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('P1 : P2 = R1 : R2 = 10Ω : 20Ω = 1 : 2', { x: 0.65, y: 3.2, w: 8.5, h: 0.28, fontSize: 12, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('【技巧】串联分压，功率与电阻成正比', { x: 0.5, y: 3.8, w: 9, h: 0.35, fontSize: 13, color: colors.dark, fontFace: 'Microsoft YaHei', italic: true });

// ===== 七、知识点脉络图 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y:
