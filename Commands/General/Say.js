const { default: axios } = require("axios");
const Command = require("../../Utils/Command.js");
const jwt = require("jsonwebtoken");

class Write extends Command {

    constructor(Bot) {

        super(Bot, {
            enabled: true,
            required_perm: 0, // Required perm to use. (If you don't want to set this value, you can type "0" or delete it.)
            usages: ["meetings"], // Command usages with aliases.
            description: "Write something with bot.", // Command description.
            category: "General", // Command category. (If you delete this option, the category is set as the name of the folder where the command file is located.)
            options: [{
                name: "type",
                description: "write a type.",
                type: 2, // 6 is type USER
                options: [
                    {
                        name: "online",
                        description: "Online Zoom Meet",
                        type: 1, // 1 is type SUB_COMMAND
                        options: [
                            {
                                name: "date",
                                description: "Mention Time in format MM/DD/YYYY",
                                type: 3, // 6 is type USER
                                required: true
                            },
                            {
                                name: "time",
                                description: "Mention Time in format HH:MM AM/PM",
                                type: 3, // 6 is type USER
                                required: true
                            },
                            {
                                name: "trader",
                                description: "Mention Role",
                                type: 8, // 6 is type USER
                                required: true,
                            }
                        ]
                    },
                    {
                        name: "webinar",
                        description: "Webinar",
                        type: 1,
                        options: [
                            {
                                name: "user",
                                description: "The user to edit",
                                type: 6,
                                required: true
                            },
                            {
                                name: "channel",
                                description: "The channel permissions to edit. If omitted, the guild permissions will be edited",
                                type: 7,
                                required: false
                            }
                        ]
                    }
                ]

            }], // All arguments options of command.,
        });

    }

    load() {

        return;

    }

    async run(interaction, guild, member, args) {
        console.log("args", args)
        let values = {}
        values.meetingType = interaction?.data?.options?.[0].options?.[0]?.name
        if (values?.meetingType === 'online') {
            interaction?.data?.options?.[0].options?.[0]?.options.forEach(element => {
                values[element?.name] = element?.value
            });
            let testCasesForDate = false
            let testCasesForTime = false
            if (values?.date) {
                const dateRegex = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g
                if (dateRegex.test(values.date)) {
                    testCasesForDate = true
                } else {
                    testCasesForDate = false
                }
            }
            if (values?.time) {
                const timeRegex = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/
                if (timeRegex.test(values.time)) {
                    testCasesForTime = true
                } else {
                    testCasesForTime = false
                }
            }
            if (!testCasesForDate) {
                return await this.Bot.send(interaction, "Please select valid date!");
            }
            if (!testCasesForTime) {
                return await this.Bot.send(interaction, "Please select valid time!");
            }
            let joinUrl = ''
            try {
                const response = await axios.post(
                    "https://api.zoom.us/v2/users/me/meetings",
                    {
                        topic: "Discord Meeting",
                        type: 2,
                        start_time: new Date(values?.date + " " + values?.time),
                        duration: 60,
                        timezone: "UTC",
                        settings: {
                            join_before_host: false,
                            mute_upon_entry: true,
                            approval_type: 2,
                            auto_recording: "none",
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await getZoomAccessToken()}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                joinUrl = response.data.join_url;
                console.log(joinUrl)
                // return msg.reply(
                //     `Your Zoom meeting has been scheduled. Join URL: ${joinUrl}`
                // );
            } catch (err) {
                console.log("err: ", err);
                // return msg.reply(
                //     "Failed to create Zoom meeting. Please try again later."
                // );
            }


            values.roleName = interaction?.data?.resolved?.roles?.[values.trader]?.name

            return await this.Bot.send(interaction, values?.meetingType.charAt(0).toUpperCase() + values?.meetingType.slice(1) + " Meeting Set for " + values?.roleName + " on " + values?.date + " at " + values?.time + ": join this URL - " + joinUrl);
        }


    }

}

async function getZoomAccessToken() {
    const payload = {
        iss: "Y0mMQYyoTUW10x3OJIZl0Q",
        exp: Date.now() + 60 * 60 * 1000, // Token expires in 1 hour
    };
    const token = jwt.sign(payload, "dsBAaS7KChHORm9zdgfR3GDJ39TOCfuEAZ99");
    return token;
}

module.exports = Write;
