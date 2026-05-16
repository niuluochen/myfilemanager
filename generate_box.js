const fs = require('fs');

// 盒子尺寸 (mm单位)
const width = 300;   // 30cm
const depth = 200;   // 20cm
const height = 150;  // 15cm
const wall = 3;      // 壁厚3mm

// 外部盒子顶点
const outer = [
  [0, 0, 0], [width, 0, 0], [width, depth, 0], [0, depth, 0],
  [0, 0, height], [width, 0, height], [width, depth, height], [0, depth, height]
];

// 内部盒子顶点
const inner = [
  [wall, wall, wall], [width-wall, wall, wall], [width-wall, depth-wall, wall], [wall, depth-wall, wall],
  [wall, wall, height], [width-wall, wall, height], [width-wall, depth-wall, height], [wall, depth-wall, height]
];

const vertices = [...outer, ...inner];

// 计算法向量
function calcNormal(v0, v1, v2) {
  const e1 = [v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2]];
  const e2 = [v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2]];
  const n = [
    e1[1]*e2[2] - e1[2]*e2[1],
    e1[2]*e2[0] - e1[0]*e2[2],
    e1[0]*e2[1] - e1[1]*e2[0]
  ];
  const len = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]);
  return len > 0 ? [n[0]/len, n[1]/len, n[2]/len] : [0,0,0];
}

// 定义所有三角形面
const faces = [
  // 外表面
  [0, 2, 1], [0, 3, 2],  // 底
  [0, 1, 5], [0, 5, 4],  // 前
  [1, 2, 6], [1, 6, 5],  // 右
  [2, 3, 7], [2, 7, 6],  // 后
  [3, 0, 4], [3, 4, 7],  // 左
  [4, 6, 5], [4, 7, 6],  // 顶
  // 内表面
  [8, 10, 9], [8, 11, 10],
  [8, 9, 13], [8, 13, 12],
  [9, 10, 14], [9, 14, 13],
  [10, 11, 15], [10, 15, 14],
  [11, 8, 12], [11, 12, 15],
  [12, 14, 13], [12, 15, 14],
];

// 生成ASCII STL
let stl = `solid box_30x20x15cm
`;

for (const face of faces) {
  const v0 = vertices[face[0]];
  const v1 = vertices[face[1]];
  const v2 = vertices[face[2]];
  const normal = calcNormal(v0, v1, v2);
  
  stl += `  facet normal ${normal[0]} ${normal[1]} ${normal[2]}\n`;
  stl += `    outer loop\n`;
  stl += `      vertex ${v0[0]} ${v0[1]} ${v0[2]}\n`;
  stl += `      vertex ${v1[0]} ${v1[1]} ${v1[2]}\n`;
  stl += `      vertex ${v2[0]} ${v2[1]} ${v2[2]}\n`;
  stl += `    endloop\n`;
  stl += `  endfacet\n`;
}

stl += `endsolid box_30x20x15cm\n`;

fs.writeFileSync('/home/ubuntu/.openclaw/workspace/box_30x20x15.stl', stl);
console.log('STL文件已生成: box_30x20x15.stl');
console.log('尺寸: 300mm x 200mm x 150mm (30cm x 20cm x 15cm)');
console.log('类型: 空心盒子, 壁厚3mm');
