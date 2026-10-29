const operationsCube = document.querySelector(".modal-cube-shell");

if (operationsCube) {
const toggleCube = () => operationsCube.classList.toggle("is-exploded");

operationsCube.addEventListener("click", toggleCube);
operationsCube.addEventListener("keydown", (event) => {
if (event.key === " " || event.key === "Enter") {
event.preventDefault();
toggleCube();
}
});
}
