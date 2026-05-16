const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.author = '小牛助手';
pptx.title = '九年级下册物理第二章 电功率';

const colors = {
  primary: '4472C4',
  secondary: 'ED7D31',
  accent: '70AD47',
  dark: '2F5496',
  light: 'D6DCE5'
};

// ===== 封面 =====
let slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.primary } });
slide.addShape('rect', { x: 0, y: 4.3, w: '100%', h: 1.2, fill: { color: colors.dark } });
slide.addText('九年级下册物理', { x: 0.5, y: 1.5, w: 9, h: 0.6, fontSize: 24, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('第二章  电功率', { x: 0.5, y: 2.3, w: 9, h: 1, fontSize: 48, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('教学PPT', { x: 0.5, y: 4.5, w: 9, h: 0.6, fontSize: 22, color: colors.light, fontFace: 'Microsoft YaHei' });

// ===== 目录 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: 0.3, h: '100%', fill: { color: colors.primary } });
slide.addText('目  录', { x: 0.8, y: 0.3, w: 8, h: 0.8, fontSize: 34, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
const tocItems = ['一、电功的概念', '二、电功率的概念与计算', '三、额定功率与实际功率', '四、测量小灯泡的电功率', '五、知识点脉络图', '六、课后练习题', '七、参考答案'];
tocItems.forEach((t, i) => {
  slide.addText(t, { x: 1, y: 1.4 + i * 0.65, w: 8, h: 0.55, fontSize: 20, color: '000000', fontFace: 'Microsoft YaHei' });
});

// ===== 一、电功的概念 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('一、电功的概念', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('1. 定义', { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('电流所做的功叫做电功，也叫消耗的电能。', { x: 0.7, y: 1.75, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 公式', { x: 0.5, y: 2.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('W = UIt', { x: 1, y: 2.85, w: 8, h: 0.4, fontSize: 20, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });
slide.addText('U—电压（V），I—电流（A），t—时间（s）', { x: 0.7, y: 3.3, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('3. 单位', { x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 国际单位：焦耳（J）', { x: 0.7, y: 4.35, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 常用单位：千瓦时（kW·h），俗称"度"', { x: 0.7, y: 4.75, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('1 kW·h = 3.6×10⁶ J', { x: 1, y: 5.2, w: 8, h: 0.4, fontSize: 18, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });

// ===== 二、电功率的概念 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('二、电功率的概念与计算', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('1. 定义', { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('电流在单位时间内所做的功，表示电流做功的快慢。', { x: 0.7, y: 1.75, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 公式', { x: 0.5, y: 2.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('P = W/t = UI', { x: 1, y: 2.85, w: 8, h: 0.4, fontSize: 20, color: colors.secondary, fontFace: 'Microsoft YaHei', italic: true });
slide.addText('P—电功率（W），W—电功（J），t—时间（s）', { x: 0.7, y: 3.3, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('3. 单位', { x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• 国际单位：瓦特（W），简称瓦', { x: 0.7, y: 4.35, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('• 常用单位：千瓦（kW），1 kW = 1000 W', { x: 0.7, y: 4.75, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 二、电功率的计算公式 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('二、电功率的计算公式', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('常用公式总结', { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('① P = W/t     （定义式）', { x: 1, y: 1.8, w: 8, h: 0.45, fontSize: 18, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('② P = UI      （普遍适用）', { x: 1, y: 2.3, w: 8, h: 0.45, fontSize: 18, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('③ P = I²R     （纯电阻电路）', { x: 1, y: 2.8, w: 8, h: 0.45, fontSize: 18, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('④ P = U²/R    （纯电阻电路）', { x: 1, y: 3.3, w: 8, h: 0.45, fontSize: 18, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addShape('rect', { x: 0.5, y: 4.0, w: 9, h: 1, fill: { color: 'FFF2CC' }, line: { color: colors.secondary, width: 1 } });
slide.addText('⚠️ 注意：公式③④只适用于纯电阻电路（如电热器、白炽灯），\n不适用于电动机等非纯电阻电路。', { x: 0.7, y: 4.15, w: 8.5, h: 0.7, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 三、额定功率与实际功率 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('三、额定功率与实际功率', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
const tableData = [
  [{ text: '概念', options: { bold: true, fill: { color: colors.primary }, color: 'FFFFFF' } },
   { text: '定义', options: { bold: true, fill: { color: colors.primary }, color: 'FFFFFF' } },
   { text: '备注', options: { bold: true, fill: { color: colors.primary }, color: 'FFFFFF' } }],
  ['额定电压 U额', '用电器正常工作时的电压', '标在铭牌上'],
  ['额定功率 P额', '在额定电压下的功率', 'P额 = U额×I额'],
  ['实际电压 U实', '实际工作时的电压', '可能≠U额'],
  ['实际功率 P实', '在实际电压下的功率', 'P实 = U实×I实']
];
slide.addTable(tableData, { x: 0.5, y: 1.2, w: 9, h: 2.2, fontFace: 'Microsoft YaHei', fontSize: 13, border: { color: colors.light, pt: 1 }, align: 'center', valign: 'middle' });
slide.addText('三种情况：', { x: 0.5, y: 3.6, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('• U实 = U额 → P实 = P额 → 正常工作', { x: 0.7, y: 4.1, w: 8, h: 0.4, fontSize: 15, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('• U实 > U额 → P实 > P额 → 可能损坏', { x: 0.7, y: 4.5, w: 8, h: 0.4, fontSize: 15, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('• U实 < U额 → P实 < P额 → 不能正常工作', { x: 0.7, y: 4.9, w: 8, h: 0.4, fontSize: 15, color: '666666', fontFace: 'Microsoft YaHei' });

// ===== 四、测量小灯泡的电功率 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('四、测量小灯泡的电功率', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('实验原理', { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('P = UI（用电压表测U，电流表测I）', { x: 1, y: 1.75, w: 8, h: 0.4, fontSize: 18, color: colors.secondary, fontFace: 'Microsoft YaHei' });
slide.addText('实验器材', { x: 0.5, y: 2.3, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('电源、小灯泡、电压表、电流表、滑动变阻器、开关、导线', { x: 0.7, y: 2.85, w: 8, h: 0.4, fontSize: 17, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('实验步骤', { x: 0.5, y: 3.4, w: 9, h: 0.5, fontSize: 22, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('1. 连接电路，变阻器滑片置于阻值最大处', { x: 0.7, y: 3.95, w: 8, h: 0.35, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 闭合开关，调节滑片使U=U额，记录I额', { x: 0.7, y: 4.3, w: 8, h: 0.35, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('3. 计算 P额 = U额 × I额', { x: 0.7, y: 4.65, w: 8, h: 0.35, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('4. 调节滑片使U略高/低于U额，测量并比较', { x: 0.7, y: 5.0, w: 8, h: 0.35, fontSize: 15, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 五、知识点脉络图 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('五、知识点脉络图', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
// 中心
slide.addShape('roundRect', { x: 3.8, y: 1.3, w: 2.4, h: 0.7, fill: { color: colors.primary } });
slide.addText('电功率', { x: 3.8, y: 1.35, w: 2.4, h: 0.6, fontSize: 20, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center', valign: 'middle' });
// 左1
slide.addShape('roundRect', { x: 0.3, y: 2.4, w: 1.5, h: 0.5, fill: { color: colors.accent } });
slide.addText('定义', { x: 0.3, y: 2.45, w: 1.5, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center' });
slide.addText('电流做功快慢\nP=W/t', { x: 0.2, y: 3.0, w: 1.7, h: 0.6, fontSize: 11, color: '000000', fontFace: 'Microsoft YaHei', align: 'center' });
// 左2
slide.addShape('roundRect', { x: 2, y: 2.4, w: 1.5, h: 0.5, fill: { color: colors.secondary } });
slide.addText('公式', { x: 2, y: 2.45, w: 1.5, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center' });
slide.addText('P=UI\nP=I²R\nP=U²/R', { x: 1.9, y: 3.0, w: 1.7, h: 0.7, fontSize: 11, color: '000000', fontFace: 'Microsoft YaHei', align: 'center' });
// 右1
slide.addShape('roundRect', { x: 6.5, y: 2.4, w: 1.5, h: 0.5, fill: { color: '9B59B6' } });
slide.addText('单位', { x: 6.5, y: 2.45, w: 1.5, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center' });
slide.addText('瓦特(W)\n千瓦(kW)', { x: 6.4, y: 3.0, w: 1.7, h: 0.6, fontSize: 11, color: '000000', fontFace: 'Microsoft YaHei', align: 'center' });
// 右2
slide.addShape('roundRect', { x: 8.2, y: 2.4, w: 1.5, h: 0.5, fill: { color: '3498DB' } });
slide.addText('测量', { x: 8.2, y: 2.45, w: 1.5, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center' });
slide.addText('P=UI\n电压表+电流表', { x: 8.1, y: 3.0, w: 1.7, h: 0.6, fontSize: 11, color: '000000', fontFace: 'Microsoft YaHei', align: 'center' });
// 下
slide.addShape('roundRect', { x: 3.8, y: 3.9, w: 2.4, h: 0.5, fill: { color: 'E74C3C' } });
slide.addText('额定与实际功率', { x: 3.8, y: 3.95, w: 2.4, h: 0.4, fontSize: 13, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center' });
slide.addText('U实=U额→正常工作\nU实>U额→可能损坏\nU实<U额→不能正常工作', { x: 3.5, y: 4.5, w: 3, h: 0.9, fontSize: 11, color: '000000', fontFace: 'Microsoft YaHei', align: 'center' });

// ===== 六、课后练习题 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('六、课后练习题', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('一、选择题（每题5分）', { x: 0.5, y: 1.2, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('1. 下列关于电功和电功率的说法正确的是（  ）', { x: 0.5, y: 1.7, w: 9, h: 0.35, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('A. 电功率越大，电流做功越多    B. 电功越大，电流做功越快', { x: 0.7, y: 2.05, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('C. 电功率越大，电流做功越快    D. 电功是表示电流做功快慢的物理量', { x: 0.7, y: 2.35, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 标有"220V 100W"的灯泡正常工作时的电流约为（  ）', { x: 0.5, y: 2.8, w: 9, h: 0.35, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('A. 0.45A    B. 2.2A    C. 22A    D. 0.22A', { x: 0.7, y: 3.15, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('二、计算题', { x: 0.5, y: 3.6, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('3. 一个"220V 1100W"的电炉正常工作时：', { x: 0.5, y: 4.05, w: 9, h: 0.35, fontSize: 14, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（1）通过电炉的电流是多少？', { x: 0.7, y: 4.4, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（2）电炉的电阻是多少？', { x: 0.7, y: 4.7, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（3）1小时内消耗多少电能？', { x: 0.7, y: 5.0, w: 8, h: 0.3, fontSize: 13, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 七、参考答案 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: colors.primary } });
slide.addText('七、参考答案', { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei' });
slide.addText('一、选择题', { x: 0.5, y: 1.2, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('1. 【答案】C', { x: 0.5, y: 1.7, w: 9, h: 0.35, fontSize: 14, bold: true, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('【解析】电功率表示电流做功的快慢，电功率越大，做功越快。电功表示电流做功的多少。', { x: 0.7, y: 2.05, w: 8, h: 0.5, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('2. 【答案】A', { x: 0.5, y: 2.65, w: 9, h: 0.35, fontSize: 14, bold: true, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('【解析】I = P/U = 100W/220V ≈ 0.45A', { x: 0.7, y: 3.0, w: 8, h: 0.35, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('二、计算题', { x: 0.5, y: 3.5, w: 9, h: 0.4, fontSize: 18, bold: true, color: colors.dark, fontFace: 'Microsoft YaHei' });
slide.addText('3. 【解答】', { x: 0.5, y: 3.95, w: 9, h: 0.35, fontSize: 14, bold: true, color: colors.accent, fontFace: 'Microsoft YaHei' });
slide.addText('（1）I = P/U = 1100W/220V = 5A', { x: 0.7, y: 4.35, w: 8, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（2）R = U/I = 220V/5A = 44Ω（或 R = U²/P = 220²/1100 = 44Ω）', { x: 0.7, y: 4.65, w: 8, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });
slide.addText('（3）W = Pt = 1100W×3600s = 3.96×10⁶J = 1.1kW·h', { x: 0.7, y: 4.95, w: 8, h: 0.3, fontSize: 12, color: '000000', fontFace: 'Microsoft YaHei' });

// ===== 结束页 =====
slide = pptx.addSlide();
slide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: colors.primary } });
slide.addText('谢谢观看', { x: 0.5, y: 2.5, w: 9, h: 1, fontSize: 48, bold: true, color: 'FFFFFF', fontFace: 'Microsoft YaHei', align: 'center' });
slide.addText('九年级下册物理  第二章 电功率', { x: 0.5, y: 4, w: 9, h: 0.5, fontSize: 20, color: colors.light, fontFace: 'Microsoft YaHei', align: 'center' });

// 保存文件
pptx.writeFile('/home/ubuntu/.openclaw/workspace/九年级物理第二章_电功率.pptx')
  .then(() => console.log('PPT已生成：九年级物理第二章_电功率.pptx'))
  .catch(err => console.error('生成失败:', err));
