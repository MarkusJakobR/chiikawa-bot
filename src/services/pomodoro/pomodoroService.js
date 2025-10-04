import { buildStartTimer, buildBreakTimer, buildEndTimer } from "./messages.js";
// const STUDY_MINUTES = 0.05;
// const BREAK_MINUTES = 5;

const activePomodoro = {};

function calculateEndTime(minutes) {
  const now = new Date();
  const endTime = new Date(now.getTime() + minutes * 60000);

  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return endTime.toLocaleTimeString([], options);
}

async function startTimer(interaction, studyMinutes, breakMinutes, cycles) {
  const channelId = interaction.channelId;
  const userId = interaction.user.id;
  const timerId = channelId + userId;
  const channel = await interaction.client.channels.fetch(channelId);

  if (activePomodoro[timerId]) {
    return interaction.reply({
      content: "You already have an active session in this channel",
      ephemeral: true,
    });
  }
  const displayName =
    interaction.member?.displayName ||
    interaction.user.username ||
    interaction.user.tag;

  const timer = {
    studentId: interaction.user.id,
    displayName,
    timerId: interaction.id,
    currCycle: 0,
    studyMinutes,
    breakMinutes,
    endTime: null,
    startEmbed: null,
    breakEmbed: null,
    endEmbed: null,
  };

  activePomodoro[timerId] = timer;

  while (timer.currCycle < cycles) {
    timer.currCycle++;
    timer.endTime = calculateEndTime(studyMinutes);
    timer.startEmbed = buildStartTimer(timer, "#F5D2D2", "pomodoroStart");

    await channel.send({
      content: `Study well, <@${timer.studentId}>!`,
      embeds: [timer.startEmbed],
    });

    await new Promise((res) => setTimeout(res, timer.studyMinutes * 60000));

    if (timer.currCycle < cycles) {
      timer.endTime = calculateEndTime(breakMinutes);
      timer.breakEmbed = buildBreakTimer(timer, "#F5D2D2", "pomodoroBreak");

      await channel.send({
        content: `Break time! Take a short ${timer.breakMinutes}-minute break, <@${timer.studentId}>!`,
        embeds: [timer.breakEmbed],
      });

      await new Promise((res) => setTimeout(res, timer.breakMinutes * 60000));
    }
  }

  timer.endEmbed = buildEndTimer(timer, "F5D2D2", "pomodoroEnd");
  await channel.send({
    content: `Congratulations <@${timer.studentId}> for completing your study session!`,
    embeds: [timer.endEmbed],
  });

  delete activePomodoro[timerId];
}

export { startTimer };
