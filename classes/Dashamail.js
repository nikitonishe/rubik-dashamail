const { Kubik } = require('rubik-main');
const querystring = require('querystring');
const fetch = require('node-fetch');
const set = require('lodash/set');

const DashamailError = require('../errors/DashamailError');
const methods = require('./Dashamail/methods');

const DEFAULT_HOST = 'https://api.dashamail.com/';

/**
 * The Dashamail kubik for the Rubik
 * @class
 * @prop {String} host the dashamail's API host
 * @prop {String} token
 */
class Dashamail extends Kubik {
  constructor(options) {
    super(...arguments);

    if (!options) options = {};
    this.host = options.host || DEFAULT_HOST;
    this.token = options.token;
    this.methods.forEach(this.generateMethod, this);
  }

  up({ config }) {
    this.config = config;
    const options = config.get(this.name);
    this.host = this.host || options.host || DEFAULT_HOST;
    this.token = this.token || options.token;
  }

  /**
   * Осуществляет запрос к Esputnik
   * @param  {String}         path   Путь запроса
   * @param  {String}         host   Хост. Если не указан будет взят из this
   * @param  {String}         token  Токен. Если не указан будет взяn из this
   * @param  {Object|String}  params Параметры запроса
   * @param  {String}         method Метод запроса. Если не указан и есть тело то будет POST, а если тела нет то GET
   * @return {Promise}
   */
  async request({ path, host, token, params, method }) {
    if (!token) token = this.token;
    if (!params) params = {};
    params.api_key = token;
    params.method = path;

    const url = `${host || this.host}?${querystring.stringify(params)}`
    if (!method) method = 'GET';

    const res = await fetch(url, { method });

    const resBody = await res.text();

    // При статусе 400 и выше возвращается текст ошибки а не json
    if (+res.status > 399) throw new DashamailError(resBody);

    // Иногда возвращается JSON иногда нет, а обрабатывать как то надо.
    return JSON.parse(resBody);
  }

  /**
   * Сгенерировать метод API
   *
   * Создает функцию для запроса к API, привязывает ее к текущему контексту
   * и кладет в семантичное имя внутри this.
   * В итоге он разбирет путь на части, и раскладывает его по семантичным объектам:
   * one/two/three -> this.one.two.three({});
   * @param  {String}  path путь запроса, без ведущего /: one/two/three
   */
  generateMethod({ kubikName, apiName, method }) {
    const apiMethod = (params, options) => {
      if (!options) options = {};
      const { host, token } = options;
      return this.request({ path: apiName, params, method, host, token });
    };
    set(this, kubikName, apiMethod);
  }
}

// Чтобы не создавать при каждой инициализации класса,
// пишем значения имени и зависимостей в протип
Dashamail.prototype.dependencies = Object.freeze(['config']);
Dashamail.prototype.methods = Object.freeze(methods);
Dashamail.prototype.name = 'dashamail';

module.exports = Dashamail;
