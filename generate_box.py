import struct
import math

def write_binary_stl(filename, vertices, faces):
    """生成二进制STL文件"""
    with open(filename, 'wb') as f:
        # 80字节头部
        f.write(b'Binary STL - Box 30x20x15cm' + b'\0' * 52)
        # 三角形数量
        f.write(struct.pack('<I', len(faces)))
        
        for face in faces:
            # 计算法向量
            v0, v1, v2 = [vertices[i] for i in face]
            edge1 = [v1[i] - v0[i] for i in range(3)]
            edge2 = [v2[i] - v0[i] for i in range(3)]
            normal = [
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            ]
            length = math.sqrt(sum(n*n for n in normal))
            if length > 0:
                normal = [n/length for n in normal]
            
            f.write(struct.pack('<fff', *normal))
            for vi in face:
                f.write(struct.pack('<fff', *vertices[vi]))
            f.write(struct.pack('<H', 0))

# 盒子尺寸 (mm单位)
width = 300   # 30cm
depth = 200   # 20cm
height = 150  # 15cm
wall = 3      # 壁厚3mm

# 外部盒子顶点
outer = [
    [0, 0, 0], [width, 0, 0], [width, depth, 0], [0, depth, 0],
    [0, 0, height], [width, 0, height], [width, depth, height], [0, depth, height]
]

# 内部盒子顶点 (空心)
inner = [
    [wall, wall, wall], [width-wall, wall, wall], [width-wall, depth-wall, wall], [wall, depth-wall, wall],
    [wall, wall, height], [width-wall, wall, height], [width-wall, depth-wall, height], [wall, depth-wall, height]
]

all_vertices = outer + inner

# 定义所有面
all_faces = [
    # 外表面
    (0, 2, 1), (0, 3, 2),  # 底
    (0, 1, 5), (0, 5, 4),  # 前
    (1, 2, 6), (1, 6, 5),  # 右
    (2, 3, 7), (2, 7, 6),  # 后
    (3, 0, 4), (3, 4, 7),  # 左
    (4, 6, 5), (4, 7, 6),  # 顶
    # 内表面
    (8, 10, 9), (8, 11, 10),
    (8, 9, 13), (8, 13, 12),
    (9, 10, 14), (9, 14, 13),
    (10, 11, 15), (10, 15, 14),
    (11, 8, 12), (11, 12, 15),
    (12, 14, 13), (12, 15, 14),
]

write_binary_stl('/home/ubuntu/.openclaw/workspace/box_30x20x15.stl', all_vertices, all_faces)
print("STL文件已生成: box_30x20x15.stl")
