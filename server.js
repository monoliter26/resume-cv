const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const { Resend } = require('resend');
const Joi = require('joi');
const path = require('path');

// Твій ключ API від Resend
const resend = new Resend('re_bJw5oL5v_2vUfxNeqr5uUtMGhc49BDouA'); 

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Плагін для роздачі статичних файлів
    await server.register(Inert);

    // 1. Ендпоінт для роздачі статичного сайту з папки public/
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, 'public'),
                index: ['index.html']
            }
        }
    });

    // 2. Ендпоінт POST /api/contact для форми зворотного зв'язку
    server.route({
        method: 'POST',
        path: '/api/contact',
        options: {
            // Базова валідація вхідних даних
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(2).required(),
                    email: Joi.string().email().required(),
                    subject: Joi.string().required(),
                    message: Joi.string().min(5).required()
                })
            }
        },
        handler: async (request, h) => {
            const { name, email, subject, message } = request.payload;

            try {
                // Відправка листа на твою пошту
                const data = await resend.emails.send({
                    from: 'Acme <onboarding@resend.dev>', // Тестовий домен Resend
                    to: ['Maksym.Kucher.KB.2024@lpnu.ua'], // Твоя пошта
                    subject: subject,
                    html: `
                        <h3>Нове повідомлення з форми зворотного зв'язку</h3>
                        <p><strong>Ім'я:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Повідомлення:</strong><br>${message}</p>
                    `
                });

                return h.response({ success: true, message: 'Лист успішно відправлено!' }).code(200);
            } catch (error) {
                console.error(error);
                return h.response({ success: false, error: 'Помилка при відправці' }).code(500);
            }
        }
    });

    await server.start();
    console.log('Сервер запущено на: %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
