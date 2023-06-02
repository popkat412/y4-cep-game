// modified from https://stackoverflow.com/a/62590644/13181476
export default function formatTimeInterval(time: number): string {
  time /= 1000;
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  let ret = "";
  if (hrs > 0) {
    ret += "" + hrs + " hours " + (mins < 10 ? "0" : "");
  }
  if (mins > 0) {
    ret +=
      "" +
      mins +
      (mins == 1 ? "minute " : " minutes ") +
      (secs < 10 ? "0" : "");
  }
  ret += "" + secs + (secs == 1 ? "second " : " seconds");
  return ret;
}
