export function drawImage(canvas: HTMLCanvasElement, file: string | any) {
  const image = new Image();
  image.onload = () => {
    const size = Math.min(image.naturalWidth, image.naturalHeight);

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  image.src = typeof file === "string" ? file : URL.createObjectURL(file);
}
