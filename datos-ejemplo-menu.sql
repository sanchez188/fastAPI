-- Datos de ejemplo para la tabla menu_items en Supabase
-- Ejecuta estos INSERT en tu base de datos Supabase

INSERT INTO menu_items (id_item, nombre, descripcion, precio, categoria, etiquetas, disponible) VALUES
('ROLL-001', 'California Roll', 'Roll clásico con cangrejo, aguacate y pepino', 3500, 'Rolls', 'clásico,popular', true),
('ROLL-002', 'Philadelphia Roll', 'Roll con salmón, queso crema y aguacate', 4200, 'Rolls', 'salmón,cremoso', true),
('ROLL-003', 'Spicy Tuna Roll', 'Roll picante con atún y mayo picante', 4800, 'Rolls', 'picante,atún', true),
('ROLL-004', 'Dragon Roll', 'Roll con tempura de camarón, aguacate y salsa anguila', 5500, 'Rolls', 'tempura,premium', true),
('ROLL-005', 'Rainbow Roll', 'Roll California cubierto con variedad de pescados', 6000, 'Rolls', 'variado,premium,colorido', true),
('ROLL-006', 'Vegetarian Roll', 'Roll con aguacate, pepino, zanahoria y lechuga', 2800, 'Rolls', 'vegetariano,saludable', true),

('SUSHI-001', 'Nigiri de Salmón', 'Arroz con lámina de salmón fresco (2 piezas)', 1800, 'Sushi', 'salmón,tradicional', true),
('SUSHI-002', 'Nigiri de Atún', 'Arroz con lámina de atún fresco (2 piezas)', 2200, 'Sushi', 'atún,tradicional', true),
('SUSHI-003', 'Nigiri de Anguila', 'Arroz con anguila glaseada (2 piezas)', 2500, 'Sushi', 'anguila,premium', true),

('SASHIMI-001', 'Sashimi de Salmón', 'Láminas de salmón fresco sin arroz (5 piezas)', 3200, 'Sashimi', 'salmón,fresco', true),
('SASHIMI-002', 'Sashimi de Atún', 'Láminas de atún fresco sin arroz (5 piezas)', 3800, 'Sashimi', 'atún,fresco', true),

('ENTRADA-001', 'Edamame', 'Vainas de soya cocidas con sal marina', 1200, 'Entradas', 'vegetariano,saludable', true),
('ENTRADA-002', 'Gyoza', 'Empanaditas japonesas rellenas de cerdo (5 piezas)', 2400, 'Entradas', 'frito,cerdo', true),
('ENTRADA-003', 'Tempura de Vegetales', 'Vegetales mixtos en tempura crujiente', 2800, 'Entradas', 'vegetariano,tempura', true),

('BEBIDA-001', 'Té Verde', 'Té verde japonés tradicional', 800, 'Bebidas', 'caliente,tradicional', true),
('BEBIDA-002', 'Sake Caliente', 'Sake japonés servido caliente', 1500, 'Bebidas', 'alcohol,caliente', true),
('BEBIDA-003', 'Ramune', 'Refresco japonés de limón', 1000, 'Bebidas', 'frío,limón', true);