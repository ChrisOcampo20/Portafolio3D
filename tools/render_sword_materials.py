"""Render clean, studio-lit material spheres from each Sword Base Color map."""

import os
from collections import defaultdict

import bpy
from mathutils import Vector


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TEXTURES = os.path.join(ROOT, 'public', 'projects', 'Sword', '03_Textura')
OUTPUT = os.path.join(ROOT, 'public', 'projects', 'Sword', '06_MaterialPreviews')

# Preserve the material order used by the project data. Each material is sampled
# only from its Base Color map; no UV image is connected to the preview sphere.
MATERIALS = [
    ('Bola', 'Bola', 'bola.png'),
    ('Bola 2', os.path.join('Bola', '2'), 'bola-2.png'),
    ('Hoja', 'Hoja', 'hoja.png'),
    ('Hoja 2', 'Hoja2', 'hoja-2.png'),
    ('Mazo', 'Mazo', 'mazo.png'),
    ('Piedras', 'Piedras', 'piedras.png'),
    ('Vendas', 'Vendas', 'vendas.png'),
]


def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def add_area(name, location, power, color, size):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = power
    data.color = color
    data.shape = 'DISK'
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    aim(obj, (0, 0, 0))


def representative_base_color(folder):
    path = os.path.join(TEXTURES, folder, 'Base Color.png')
    if not os.path.isfile(path):
        raise FileNotFoundError(path)

    image = bpy.data.images.load(path, check_existing=True)
    image.colorspace_settings.name = 'sRGB'
    width, height = image.size
    channels = image.channels
    pixels = image.pixels[:]
    step = max(1, max(width, height) // 256)

    # Quantized color buckets make the dominant albedo robust to fine texture
    # detail. Ignore transparent texels and near-black empty padding.
    buckets = defaultdict(lambda: [0, 0.0, 0.0, 0.0])
    for y in range(0, height, step):
        for x in range(0, width, step):
            offset = (y * width + x) * channels
            red, green, blue = pixels[offset:offset + 3]
            alpha = pixels[offset + 3] if channels > 3 else 1.0
            if alpha <= 0.05 or max(red, green, blue) <= 0.025:
                continue

            key = (round(red * 31), round(green * 31), round(blue * 31))
            bucket = buckets[key]
            bucket[0] += 1
            bucket[1] += red
            bucket[2] += green
            bucket[3] += blue

    if not buckets:
        raise ValueError(f'No visible Base Color pixels found: {path}')

    count, red_sum, green_sum, blue_sum = max(buckets.values(), key=lambda item: item[0])
    color = (red_sum / count, green_sum / count, blue_sum / count)
    print(f'{os.path.basename(folder)} dominant Base Color: {tuple(round(c, 4) for c in color)}')
    return color


def make_material(name, color):
    material = bpy.data.materials.new(f'{name} · Base Color Preview')
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    shader = nodes.new('ShaderNodeBsdfPrincipled')
    shader.inputs['Base Color'].default_value = (*color, 1.0)
    shader.inputs['Metallic'].default_value = 0.0
    shader.inputs['Roughness'].default_value = 0.42
    output = nodes.new('ShaderNodeOutputMaterial')
    material.node_tree.links.new(shader.outputs['BSDF'], output.inputs['Surface'])
    return material


def main():
    os.makedirs(OUTPUT, exist_ok=True)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 840
    scene.render.resolution_y = 640
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.film_transparent = False
    scene.view_settings.view_transform = 'AgX'
    scene.world.color = (0.018, 0.022, 0.028)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=96, radius=1, location=(0, 0, 0))
    sphere = bpy.context.object
    sphere.name = 'Clean Base Color Preview Sphere'
    for polygon in sphere.data.polygons:
        polygon.use_smooth = True

    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -1.015))
    floor = bpy.context.object
    floor.name = 'Dark studio floor'
    floor_mat = bpy.data.materials.new('Studio charcoal')
    floor_mat.diffuse_color = (0.025, 0.03, 0.038, 1)
    floor_mat.use_nodes = True
    floor_mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = (0.025, 0.03, 0.038, 1)
    floor_mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value = 0.82
    floor.data.materials.append(floor_mat)

    add_area('Key softbox', (3.2, -4.0, 4.0), 440, (1.0, 1.0, 1.0), 4.0)
    add_area('Fill softbox', (-4.0, -1.0, 1.4), 230, (1.0, 0.92, 0.82), 3.5)
    add_area('Rim softbox', (0.4, 2.6, 3.4), 500, (0.82, 0.88, 1.0), 3.0)

    camera_data = bpy.data.cameras.new('Preview Camera')
    camera = bpy.data.objects.new('Preview Camera', camera_data)
    bpy.context.collection.objects.link(camera)
    camera.location = (3.1, -5.4, 2.5)
    aim(camera, (0, 0, -0.05))
    camera_data.type = 'ORTHO'
    camera_data.ortho_scale = 4.0
    scene.camera = camera

    for name, folder, filename in MATERIALS:
        sphere.data.materials.clear()
        sphere.data.materials.append(make_material(name, representative_base_color(folder)))
        scene.render.filepath = os.path.join(OUTPUT, filename)
        bpy.ops.render.render(write_still=True)
        print(f'Rendered {name}: {scene.render.filepath}')


if __name__ == '__main__':
    main()
