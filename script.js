window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // canvasサイズの設定
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // マウス位置の取得
  const mouse = {
    x: undefined,
    y: undefined,
    radius: 100  // マウスの影響を与える半径
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  // Ballクラスの定義
  class Ball {
    constructor(x, y, dx, dy, radius, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // 壁での反射処理
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

      // マウスとの距離による反発効果
      if (mouse.x !== undefined && mouse.y !== undefined) {
        const dxMouse = this.x - mouse.x;
        const dyMouse = this.y - mouse.y;
        const distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distance < mouse.radius + this.radius) {
          const angle = Math.atan2(dyMouse, dxMouse);
          const force = (mouse.radius + this.radius - distance) / (mouse.radius + this.radius);
          // 反発力を加算
          this.dx += Math.cos(angle) * force * 2;
          this.dy += Math.sin(angle) * force * 2;
        }
      }

      // 徐々に減衰させる（摩擦効果）
      this.dx *= 0.99;
      this.dy *= 0.99;

      // 位置の更新
      this.x += this.dx;
      this.y += this.dy;

      this.draw();
    }
  }

  // カラーボールの生成
  const balls = [];
  const numberOfBalls = 30;  // ボールの数
  const pastelColors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E3BAFF'];

  for (let i = 0; i < numberOfBalls; i++) {
    const radius = Math.random() * 20 + 10; // 10～30の半径
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 4;  // -2～2の速度
    const dy = (Math.random() - 0.5) * 4;
    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    balls.push(new Ball(x, y, dx, dy, radius, color));
  }

  // アニメーションループ
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
  }

  animate();
});
