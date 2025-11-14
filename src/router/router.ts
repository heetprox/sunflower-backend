import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { auth, requiresAuth } from "express-openid-connect";
import { asyncHandler, isAuthenticated } from "@/handlers/errorHandler";
import { setUsername } from "@/functions/setUsername";
import { checkOnboarding } from "@/functions/checkOnboarding";
import { sendFriendRequest } from "@/functions/sendFriendRequest";
import { acceptFriendRequest } from "@/functions/acceptFriendRequest";
import { rejectFriendRequest } from "@/functions/rejectFriendRequest";
import { getFriends } from "@/functions/getFriends";
import { getFriendRequests } from "@/functions/getFriendRequests";
import { removeFriend } from "@/functions/removeFriend";
import { searchUsers } from "@/functions/searchUsers";
import { getMessages } from "@/functions/socket/getMessages";
import { getUsersToChat } from "@/functions/socket/getUsersToChat";
import { sendMessage } from "@/functions/socket/sendMessage";
import { checkUserExists } from "@/functions/checkUserExists";
import { editProfile } from "@/functions/editProfile";
import { getUserProfile } from "@/functions/user/getUserProfile";

const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET || 'a-long-randomly-generated-string-stored-in-env',
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID || '8XTdDEi85au9S5QbO04cVVWL4jokIT8G',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-e0f8moytylh81hai.us.auth0.com',
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    idpLogout: true,
    routes: {
        login: '/auth/login',
        logout: '/auth/logout',
        callback: '/auth/callback'
    },
    session: {
        rollingDuration: 24 * 60 * 60,
        absoluteDuration: 7 * 24 * 60 * 60 
    }
};



const router = Router();

router.use(auth(authConfig));

router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
router.get('/auth/login/google', (req: any, res: any) => {
    req.oidc.login({
        authorizationParams: {
            connection: 'google-oauth2',
            scope: 'openid profile email'
        }
    });
});

router.get('/auth/login/twitter', (req: any, res: any) => {
    req.oidc.login({
        authorizationParams: {
            connection: 'twitter',
            scope: 'openid profile email'
        }
    });
});

router.get('/auth/login', (req: any, res: any) => {
    req.oidc.login({
        returnTo: req.query.returnTo as string || '/'
    });
});

router.get('/auth/profile', requiresAuth(), (req: any, res: any) => {
    res.json({
        user: req.oidc.user,
        isAuthenticated: req.oidc.isAuthenticated()
    });
});

router.get('/auth/status', (req: any, res: any) => {
    res.json({
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.isAuthenticated() ? req.oidc.user : null
    });
});

router.post('/logout', (req: any, res: Response) => {
    req.oidc.logout({ returnTo: process.env.AUTH0_BASE_URL || 'http://localhost:3000' });
});

// User profile routes
router.get('/profile/me', isAuthenticated ,(req: any, res: Response) => {
    res.json({
        user: req.oidc.user,
        isAuthenticated: req.oidc.isAuthenticated()
    });
});
router.get('/profile/:id', isAuthenticated, asyncHandler(getUserProfile));
router.get('/auth/check', isAuthenticated, asyncHandler(checkUserExists));
router.post('/username', isAuthenticated, asyncHandler(setUsername));
router.post('/profile/edit', isAuthenticated, asyncHandler(editProfile));
router.get('/onboarding', isAuthenticated, asyncHandler(checkOnboarding));

// Messaging routes
router.get('/messages/users', isAuthenticated, asyncHandler(getUsersToChat));
router.get('/messages/:id', isAuthenticated, asyncHandler(getMessages));
router.post('/messages/send/:id', isAuthenticated, asyncHandler(sendMessage));

// Friend management routes
router.get('/friends', isAuthenticated, asyncHandler(getFriends));
router.get('/search', isAuthenticated, asyncHandler(searchUsers));
router.get('/requests', isAuthenticated, asyncHandler(getFriendRequests));
router.post('/request/:id', isAuthenticated, asyncHandler(sendFriendRequest));
router.put('/request/:requestId/accept', isAuthenticated, asyncHandler(acceptFriendRequest));
router.put('/request/:requestId/reject', isAuthenticated, asyncHandler(rejectFriendRequest));
router.delete('/friends/:friendId', isAuthenticated, asyncHandler(removeFriend));

export default router;