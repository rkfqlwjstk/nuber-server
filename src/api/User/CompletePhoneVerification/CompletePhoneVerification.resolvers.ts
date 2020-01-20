import User from '../../../entities/User';
import Verification from '../../../entities/Verification';
import createJWT from '../../../utils/createJWT';
import { CompletePhoneVerificationMutationArgs, CompletePhoneVerificationResponse } from 'src/types/graph';
import { Resolvers } from 'src/types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    CompletePhoneVerification: async (
      _,
      args: CompletePhoneVerificationMutationArgs
    ): Promise<CompletePhoneVerificationResponse> => {
        const { phoneNumber, key } = args;
        try {
           const verifivation = await Verification.findOne({
               payload: phoneNumber,
               key
           });
           if(!verifivation){
               return {
                   ok: false,
                   error: "Verification key not valid",
                   token: null
               };
           } else {
               verifivation.verified = true;
               verifivation.save();
           }
        } catch (error) {
            return {
                ok: false,
                error: error.message,
                token: null
            };
        }

        try {
            const user = await User.findOne({phoneNumber});
            if(user){
                user.verifiedPhoneNumber = true;
                user.save();
                const token = createJWT(user.id);
                return {
                    ok: true,
                    error: null,
                    token
                };
            } else {
                return {
                    ok: true,
                    error: null,
                    token: null
                };
            }
        } catch (error) {
            return {
                ok: false,
                error: error.message,
                token: null
            };
        }
    }
  }
};

export default resolvers;