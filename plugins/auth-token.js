const TokenManager             =            require('../app/lib/TokenManager'),
          Config               =            require('../config');

exports.plugin = {
name: 'auth',
register: async (server, options) => {
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy(Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN, 'jwt',
        { key:process.env.JWT_SECRET_KEY,
            validate:TokenManager.verifyToken,
            verifyOptions: { algorithms: [ 'HS256' ] }
        });

    server.auth.strategy(Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER, 'jwt',
        { key:process.env.JWT_SECRET_KEY,
            validate: TokenManager.verifyToken,
            verifyOptions: { algorithms: [ 'HS256' ] }
        });

    server.auth.strategy(Config.APP_CONSTANTS.DATABASE.USER_ROLES.COMMON, 'jwt',
        { key:process.env.JWT_SECRET_KEY,
            validate: TokenManager.verifyToken,
            verifyOptions: { algorithms: [ 'HS256' ] }
        });
}
};
