export function starMove (canvas) {
    if (!canvas || canvas.tagName.toUpperCase() !== 'CANVAS') {
        console.error('canvas标签不存在')
        return
    }
    const ctx = canvas.getContext('2d')
    let centerX
    let centerY
    let stars = []
    const starCount = 1500

    function initializePos () {
        centerX = canvas.width / 2
        centerY = canvas.height / 2
        stars = []
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * canvas.width,
                o: '0.' + Math.floor(Math.random() * 9) + 1
            })
        }
    }

    function drawStar (ctx, star) {
        ctx.save()
        ctx.translate(star.offsetX, star.offsetY)
        ctx.rotate(star.angle / 180 * Math.PI)
        ctx.scale(star.radius, star.radius)
        pathStar(ctx)
        ctx.fillStyle = 'rgb(255, 255, 0)'
        ctx.fill()
        ctx.restore()
    }
    function pathStar (ctx) {
        ctx.beginPath()
        let x = 0; let y = 0
        for (let i = 0; i < 5; i++) {
            x = Math.cos((18 + 72 * i) / 180 * Math.PI)
            y = Math.sin((18 + 72 * i) / 180 * Math.PI)
            ctx.lineTo(x, 0 - y)
            x = Math.cos((54 + 72 * i) / 180 * Math.PI) / 2
            y = Math.sin((54 + 72 * i) / 180 * Math.PI) / 2
            ctx.lineTo(x, 0 - y)
        }
        ctx.closePath()
    }

    // z轴运动
    function move () {
        for (let i = 0; i < starCount; i++) {
            stars[i].z--
            if (stars[i].z <= 0) {
                stars[i].z = canvas.width
            }
        }
    }

    function draw () {
        // 绘制画布背景
        if (canvas.width !== window.innerWidth) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initializePos()
        }
        ctx.fillStyle = 'rgba(0,10,20,1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        // 绘制星星
        for (let i = 0; i < starCount; i++) {
            drawStar(ctx, {
                offsetX: centerX + (stars[i].x - centerX) * (canvas.width / 2 / stars[i].z),
                offsetY: centerY + (stars[i].y - centerY) * (canvas.width / 2 / stars[i].z),
                radius: canvas.width / 2 / stars[i].z,
                angle: Math.random() * 90
            })
        }
    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame
    })()

    function executeFrame () {
        window.requestAnimFrame(executeFrame)
        move()
        draw()
    }

    initializePos()
    executeFrame()
}
