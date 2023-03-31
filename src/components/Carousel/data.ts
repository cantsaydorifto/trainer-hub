// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const carouselData = [...Array(36)].map((el, idx) => {
  const id = `${idx}00${Math.floor(Math.random() * 905) + 1}`;
  return {
    link: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.slice(
      -3
    )}.png`,
    id,
  };
});
