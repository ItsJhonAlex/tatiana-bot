import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type ChatInputCommandSuccessPayload } from '@sapphire/framework';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { mapDiscordLocale } from '../lib/utils/locale';

@ApplyOptions<Listener.Options>({
  event: Events.ChatInputCommandSuccess
})
export class ChatInputCommandSuccessListener extends Listener {
  public override async run(payload: ChatInputCommandSuccessPayload) {
    const { interaction } = payload;
    const user = interaction.user;

    try {
      // Verificar si el usuario ya existe en la base de datos
      const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

      // Mapear locale de Discord a idioma soportado
      const language = mapDiscordLocale(interaction.locale);

      if (existingUser.length === 0) {
        // Registrar nuevo usuario en la base de datos
        await db.insert(users).values({
          id: user.id,
          username: user.username,
          globalName: user.globalName ?? null,
          avatar: user.avatar ?? null,
          bot: user.bot,
          language
        });

        this.container.logger.info(`Registered new user: ${user.username} (${user.id}) - Language: ${language}`);
      } else {
        // Actualizar información del usuario si cambió
        const dbUser = existingUser[0];
        if (
          dbUser &&
          (dbUser.username !== user.username ||
            dbUser.globalName !== (user.globalName ?? null) ||
            dbUser.avatar !== (user.avatar ?? null))
        ) {
          await db
            .update(users)
            .set({
              username: user.username,
              globalName: user.globalName ?? null,
              avatar: user.avatar ?? null
            })
            .where(eq(users.id, user.id));

          this.container.logger.debug(`Updated user info: ${user.username} (${user.id})`);
        }
      }
    } catch (error) {
      this.container.logger.error(`Failed to register/update user ${user.username} (${user.id}):`, error);
    }
  }
}
