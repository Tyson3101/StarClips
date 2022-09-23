export default function generateAvatar() {
  return `https://avatars.dicebear.com/api/adventurer-neutral/${Math.floor(
    Math.random() * 1000
  )}.svg`;
}
