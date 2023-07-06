
function EmailVerify({ email, onContinue }) {
    return (
        <ProcessWrapper>
            <div style={{ margin: 'var(--sp-normal)', maxWidth: '450px' }}>
                <Text variant="h2" weight="medium">Verify email</Text>
                <div style={{ margin: 'var(--sp-normal) 0' }}>
                    <Text variant="b1">
                        {'Please check your email '}
                        <b>{`(${email})`}</b>
                        {' and validate before continuing further.'}
                    </Text>
                </div>
                <Button variant="primary" onClick={onContinue}>Continue</Button>
            </div>
        </ProcessWrapper>
    );
}
EmailVerify.propTypes = {
    email: PropTypes.string.isRequired,
};

export default EmailVerify;