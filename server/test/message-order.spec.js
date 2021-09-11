require('dotenv').config()
const chai      = require("chai");
const expect    = chai.expect;
const chaiHttp  = require("chai-http");
const moment    = require('moment');
const {app}     = require("../app.js");

chai.use(chaiHttp);
const agent = chai.request.agent(app);

describe("Message Display Order", () => {
    it("should display oldest to newest messages in a conversation", done => {
        agent
            .post(`/auth/login`)
            .send({username: "thomas", password: '123456'})
            .then(res => {
                const token = res.body.token;
                agent
                    .get(`/api/conversations`)
                    .set('x-access-token', token)
                    .end((err, response) => {
                        const messages = response.body[2].messages; //grab the first conversation; with santiago
                        let correctOrder = true;
                        for(let i = 1; i < messages.length; i++) {
                            const first = moment(messages[i-1].createdAt, "h:mm:ss:SSS");
                            const second = moment(messages[i].createdAt, "h:mm:ss:SSS");
                            const timeCheck = first.isBefore(second);

                            if(!timeCheck) {
                                correctOrder = false;
                                break;
                            }
                        }
                        expect(correctOrder).to.be.true;
                        return done();
                    });  
            })
            
    })
})